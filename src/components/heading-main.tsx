import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function HeadingMain({
  children,
  title,
  description,
  hasBackNavigation = false
}: {
  children?: React.ReactNode;
  title: string;
  description?: string;
  hasBackNavigation?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative mt-4 flex flex-col items-start gap-4 md:mt-6 md:flex-row">
        {hasBackNavigation && (
          <div className="absolute -left-12 top-0 hidden lg:block">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 min-w-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </div>
        )}
        <div className="flex-1 shrink-0 flex-col">
          <div className="flex gap-x-2">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {title}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        <div className="items-center gap-2 md:ml-auto">{children}</div>
      </div>
    </>
  );
}
