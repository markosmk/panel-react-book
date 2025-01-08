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
      <div className="relative mt-4 flex items-start gap-4 md:mt-6">
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
            {/* <Badge variant="outline" className="ml-auto sm:ml-0">
              Disponible
            </Badge> */}
          </div>
          <p className="text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        {/* {children && ( */}
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {children}
          {/* <Button variant="outline" size="sm">
            Cancelar
          </Button>
          <Button size="sm">Guardar Cambios</Button> */}
        </div>
        {/* )} */}
      </div>
      {/* <div className="relative mt-6 flex items-start justify-between">
        <div className="flex w-full flex-col">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 md:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        {children && (
          <div className="mt-2 flex items-center justify-center space-x-2">
            {children}
          </div>
        )}
      </div> */}
    </>
  );
}
