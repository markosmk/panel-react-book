import * as React from 'react';

export function useElementWidth() {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [width, setWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref]);

  return { ref, width };
}
