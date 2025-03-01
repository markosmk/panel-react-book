import { HelpCircleIcon, LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type Props = {
  content: string;
  className?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
};

export function TooltipHelper({
  icon: Icon,
  content,
  className,
  children,
  align
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn('inline-flex', className)}>
          {children ? (
            children
          ) : Icon ? (
            <Icon className="h-4 w-4 text-muted-foreground/60" />
          ) : (
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground/60" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 bg-black" align={align}>
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
