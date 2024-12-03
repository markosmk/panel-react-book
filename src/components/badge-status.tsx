import { cn } from '@/lib/utils';

import { IconSVG, Icons } from './icons';
import { Badge, BadgeProps } from './ui/badge';
import { Status } from '@/types/booking.types';

type BadgeStatusProps = BadgeProps & {
  status: Status | 'Default';
  useIcons?: boolean;
};

const currentVariant: Record<
  string,
  {
    variant: 'wrong' | 'success' | 'warning' | 'default';
    icon: IconSVG;
    text: string;
  }
> = {
  CANCELED: { variant: 'wrong', icon: Icons.warning, text: 'Cancelado' },
  CONFIRMED: { variant: 'success', icon: Icons.success, text: 'Confirmado' },
  PENDING: { variant: 'warning', icon: Icons.pending, text: 'Pendiente' },
  Default: { variant: 'default', icon: Icons.help, text: 'N/A' }
};

export function BadgeStatus({
  status = 'Default',
  useIcons = false,
  ...props
}: BadgeStatusProps) {
  const {
    variant,
    icon: Icon,
    text
  } = currentVariant[status] ?? currentVariant['Default'];
  return (
    <Badge
      variant={variant}
      className={cn(
        useIcons && 'flex h-8 w-8 items-center justify-center p-0',
        props.className
      )}
      {...props}
    >
      {useIcons ? <Icon className="h-4 w-4" /> : text}
    </Badge>
  );
}
