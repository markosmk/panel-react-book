import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from './ui/button';
import { ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

export function CollapsibleHelp({
  children,
  title,
  noIcon,
  className
}: {
  children: React.ReactNode;
  title: string;
  noIcon: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('w-full space-y-2', className)}
    >
      {noIcon ? (
        <CollapsibleTrigger asChild>
          <Button variant="secondary" size="sm">
            <div className="flex items-center">
              <Icons.help className="mr-2 h-5 w-5 text-muted-foreground" />
              {title}
            </div>
          </Button>
        </CollapsibleTrigger>
      ) : (
        <div className="flex items-center justify-between space-x-4 px-4">
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{title}</h4>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDownIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      )}

      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}
