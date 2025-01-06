import { Icons } from './icons';

export function NoContent({ description }: { description?: string }) {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4 text-muted-foreground md:py-8 lg:py-12">
      <Icons.info className="h-10 w-10" />
      <div className="flex flex-col items-center space-y-1 py-4">
        <p className="text-center text-sm text-muted-foreground">
          {description || 'No hay contenido disponible'}
        </p>
      </div>
    </div>
  );
}
