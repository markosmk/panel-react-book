/* eslint-disable react-refresh/only-export-components */
import { Status } from '@/types/booking.types';

import { IconSVG, Icons } from './icons';
import { Badge, BadgeProps } from './ui/badge';
import { TooltipHelper } from './tooltip-helper';
import { cn } from '@/lib/utils';

type BadgeStatusProps = BadgeProps & {
  status: Status | 'Default';
  useIcon?: boolean;
};

type StatusVariant = Record<
  Status | 'Default',
  {
    variant: 'wrong' | 'success' | 'warning' | 'default';
    icon: IconSVG;
    text: string;
    className?: string;
    bgColor?: string;
  }
>;

export const statusVariant: StatusVariant = {
  CONFIRMED: {
    variant: 'success',
    icon: Icons.success,
    text: 'Confirmado',
    className: 'text-green-600',
    bgColor: 'bg-gradient-to-b from-emerald-800 to-green-500'
  },
  PENDING: {
    variant: 'warning',
    icon: Icons.pending,
    text: 'Pendiente',
    className: 'text-yellow-600',
    bgColor: 'bg-gradient-to-b from-amber-700 to-yellow-500'
  },
  CANCELED: {
    variant: 'wrong',
    icon: Icons.warning,
    text: 'Cancelado',
    className: 'text-red-600',
    bgColor: 'bg-gradient-to-b from-rose-800 to-red-500'
  },
  Default: {
    variant: 'default',
    icon: Icons.help,
    text: 'N/A',
    className: 'text-gray-600',
    bgColor: 'bg-gradient-to-b from-gray-800 to-gray-500'
  }
};

export function BadgeStatus({
  status = 'Default',
  useIcon = false,
  ...props
}: BadgeStatusProps) {
  const {
    variant,
    icon: Icon,
    text,
    className
  } = statusVariant[status] ?? statusVariant['Default'];

  if (useIcon) {
    return (
      <TooltipHelper content={text}>
        <Icon className={cn('h-4 w-4', className)} />
      </TooltipHelper>
    );
  }

  return (
    <Badge variant={variant} className={props.className} {...props}>
      {text}
    </Badge>
  );
}
