/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

import { useRouter } from '@/routes/hooks/use-router';
// Providers
import { ThemeProvider } from './theme-provider';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { ModalProvider } from '@/hooks/use-modal';
// Components
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NotificationContainer } from '@/components/notifications';
// Stores
import { useAuthStore } from '@/stores/use-auth-store';

export const queryClient = new QueryClient();

const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter();
  return (
    <div
      className="flex h-screen w-screen flex-col items-center  justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">Ooops, something went wrong:</h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className="mt-4" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
};

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  React.useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <React.Suspense>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <NotificationContainer />
              <TooltipProvider delayDuration={400}>
                <ModalProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </ModalProvider>
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </React.Suspense>
  );
}
