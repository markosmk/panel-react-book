import * as React from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExpandable } from '@/hooks/use-expandable';

interface CardExpandableProps {
  minHeight: number;
  children: React.ReactNode;
}

export function CardExpandable({
  minHeight,
  children
}: CardExpandableProps): JSX.Element {
  const {
    isExpanded,
    setIsExpanded,
    contentHeight,
    contentRef,
    showExpandButton
  } = useExpandable(minHeight);

  if (!showExpandButton) {
    return (
      <Card className="relative mt-3 overflow-hidden">
        <div ref={contentRef}>{children}</div>
      </Card>
    );
  }

  return (
    <Card className="relative mt-2 overflow-hidden pb-12">
      <div
        ref={contentRef}
        style={{ height: isExpanded ? `${contentHeight}px` : `${minHeight}px` }}
        className="transition-[height] duration-300 ease-in-out"
      >
        {children}
      </div>

      {!isExpanded && (
        <div className="absolute bottom-12 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
      )}

      <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-card p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ver menos' : 'Ver completo'}
        </Button>
      </div>
    </Card>
  );
}
