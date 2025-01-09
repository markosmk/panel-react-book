/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

import { useRouter } from '@/routes/hooks/use-router';
// Providers
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { SidebarProvider } from '@/hooks/use-sidebar';
// Components
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ModalProvider } from '@/hooks/use-modal';
import { NotificationContainer } from '@/components/notifications';

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
  return (
    <Suspense>
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
                  <SidebarProvider>
                    <AuthProvider>{children}</AuthProvider>
                  </SidebarProvider>
                </ModalProvider>
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Suspense>
  );
}
