import { Icons } from './icons';

export function ErrorContent() {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4 text-muted-foreground md:py-8 lg:py-12">
      <Icons.error className="h-10 w-10" />
      <div className="flex flex-col items-center space-y-1 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Sucedio un error, al procesar la solicitud. Intenta nuevamente mas
          tarde.
        </p>
        <p className="text-center text-xs text-muted-foreground/70">
          Si el error persiste, contacta a un administrador para resolver el
          problema.
        </p>
      </div>
    </div>
  );
}
