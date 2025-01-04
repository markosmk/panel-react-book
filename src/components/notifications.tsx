/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode } from 'react';
import { ExternalToast, toast as baseToast, Toaster } from 'sonner';

import { Icons } from './icons';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export type TNotification = {
  description: ReactNode;
  title?: string;
};

const iconMapping = {
  success: <Icons.check className="h-6 w-6 text-[#53f0a0]" />,
  error: <Icons.error className="h-6 w-6 text-[#f05353]" />,
  info: <Icons.info className="h-6 w-6 text-[#4c88e8]" />,
  warning: <Icons.warning className="h-6 w-6 text-[#f0c053]" />
};

export const NotificationContent = ({
  title,
  description,
  type,
  idToast
}: TNotification & {
  type: ToastType;
  idToast: number | string;
}) => {
  return (
    <div
      className={cn(
        'cursor-pointer select-none p-0 transition-all active:scale-95',
        'flex items-center gap-2 rounded-md p-4',
        'toast group select-none border border-border bg-card text-base text-muted-foreground md:border-2',
        type === 'success' &&
          'border-[#06351c] bg-[#031c12] text-[#53f0a0] hover:border-[#197b48]',
        type === 'info' &&
          'border-[#001234] bg-[#010f1c] text-[#4c88e8] hover:border-[#1d4e9c]',
        type === 'warning' &&
          'border-[#342600] bg-[#1c1401] text-[#f0c053] hover:border-[#ab8120]',
        type === 'error' &&
          'border-[#340000] bg-[#1c0101] text-[#f05353] hover:border-[#a92424]'
      )}
      onClick={() => baseToast.dismiss(idToast)}
    >
      {iconMapping[type] && <div className="mr-2.5">{iconMapping[type]}</div>}
      <div className="flex flex-col">
        {title && <div className="text-md mb-1 font-medium">{title}</div>}
        <div className={title ? 'text-sm' : 'text-md'}>{description}</div>
      </div>
    </div>
  );
};

export const createNotification = (
  descriptionOrOptions: string | (TNotification & { type?: ToastType }),
  toastOptions: ExternalToast = {}
) => {
  const isString = typeof descriptionOrOptions === 'string';
  const props: TNotification & { type: ToastType } = isString
    ? { description: descriptionOrOptions, type: 'info' }
    : { ...descriptionOrOptions, type: descriptionOrOptions.type || 'info' };

  return baseToast.custom(
    (t) => <NotificationContent {...props} idToast={t} type={props.type} />,
    {
      ...toastOptions
    }
  );
};

export const toast = {
  ...baseToast,
  success: (description: string | ReactNode, options?: ExternalToast) =>
    createNotification({ description, type: 'success' }, options),
  error: (description: string | ReactNode, options?: ExternalToast) =>
    createNotification({ description, type: 'error' }, options),
  info: (description: string | ReactNode, options?: ExternalToast) =>
    createNotification({ description, type: 'info' }, options),
  warning: (description: string | ReactNode, options?: ExternalToast) =>
    createNotification({ description, type: 'warning' }, options),
  dismiss: (id: number | string | undefined = undefined) =>
    baseToast.dismiss(id)
};

type ToasterProps = React.ComponentProps<typeof Toaster>;

export const NotificationContainer = ({ ...props }: ToasterProps) => (
  <Toaster
    visibleToasts={1}
    expand={true}
    position="top-right"
    toastOptions={{
      duration: 2500
    }}
    {...props}
  />
);
