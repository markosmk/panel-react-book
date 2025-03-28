import { Language } from '@/types/booking.types';

interface LanguageFlagProps {
  language: Language;
}

export function LanguageFlag({ language }: LanguageFlagProps) {
  const flag = {
    es: '/assets/flag_spain.png',
    en: '/assets/flag_united_states.png'
  };

  const src = language ? flag[language] : null;

  return (
    <div className="h-4 w-6 overflow-hidden rounded">
      {src ? (
        <img
          src={src}
          alt={`Flag of ${language}`}
          className="h-4 w-6 object-cover"
        />
      ) : (
        <div className="h-4 w-6 rounded bg-muted-foreground/30" />
      )}
    </div>
  );
}
