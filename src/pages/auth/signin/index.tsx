import UserAuthForm from './components/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const quotes = [
  {
    quote:
      'Un buen vino es como una buena filmer: dura un instante y te deja en la boca un sabor a gloria; es nuevo en cada sorbo y, como ocurre con las peliculas, nace y renace en cada sorbador.',
    author: 'Federico Fellini'
  },
  {
    quote:
      'El que sabe degustar no bebe demasiado vino, pero disfruta sus suaves secretos.',
    author: 'Salvador Dalí'
  },
  {
    quote:
      'El vino abre las puertas con asombro y en el refugio de los meses vuelca su cuerpo de empapadas alas rojas.',
    author: 'Pablo Neruda'
  },
  {
    quote:
      'Existe en la esfera terrestre un gentío innumerable e innominado cuyo sueño no podría dormir los pesares. El vino escribe para ellos cantos y poemas.',
    author: 'Charles Baudelaire'
  }
];

function RandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <blockquote className="space-y-2">
      <p className="text-lg">&ldquo;{quote.quote}&rdquo;</p>
      <footer className="text-sm">{quote.author}</footer>
    </blockquote>
  );
}

export default function SignInPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r  lg:flex">
        <div className="absolute inset-0 bg-primary dark:bg-secondary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            src="/assets/logo-main.png"
            alt="zorzal wines app"
            className="w-44"
          />
          <span className="sr-only">Zorzal Wines App</span>
        </div>
        <div className="relative z-20 mt-auto">
          <RandomQuote />
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa con tus credenciales para continuar
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
