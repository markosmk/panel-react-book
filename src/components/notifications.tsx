/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from 'react';
import { ExternalToast, toast, Toaster } from 'sonner';

import { Icons } from './icons';

export type TNotification = {
  title?: string;
  text: ReactNode;
};

export const NotificationContent = ({ title, text }: TNotification) => {
  return (
    <div className="select-none p-0">
      {title && <div className="text-md mb-1 font-medium">{title}</div>}
      <div className={title ? 'text-sm' : 'text-md'}>{text}</div>
    </div>
  );
};

export const createNotification = (
  myProps: TNotification & { type: 'error' | 'success' | 'info' },
  toastProps: ExternalToast = {}
): string | number => {
  const options: ExternalToast = {
    position: 'top-center',
    ...toastProps
  };

  if (myProps.type === 'error') {
    return toast.error(myProps.text, options);
  } else if (myProps.type === 'success') {
    return toast.success(myProps.text, options);
  } else if (myProps.type === 'info') {
    return toast.info(myProps.text, options);
  } else {
    return toast(<NotificationContent {...myProps} />, options);
  }
};

type ToasterProps = React.ComponentProps<typeof Toaster>;
export const NotificationContainer = ({ ...props }: ToasterProps) => (
  <Toaster
    visibleToasts={1}
    expand={true}
    // className="toaster group"
    position="top-right"
    toastOptions={{
      duration: 2500,
      classNames: {
        toast:
          'group toast border select-none font-medium text-base bg-card text-muted-foreground border-border',
        //   description: "group-[.toast]:text-muted-foreground group-[.toast]:select-none",
        //   actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        //   cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        //   closeButton:
        //     "group-[.toast]:bg-gray-500 border-4 h-7 w-7 border-gray-700 group-[.toast]:text-muted-foreground left-auto -right-4 group-[.toast]:hover:bg-gray-800 group-[.toast]:hover:border-gray-700 [&_svg]:[stroke-width:3]",
        icon: 'mr-2.5',
        success: '!bg-[#031c12] !text-[#53f0a0] !border-[#06351c]',
        info: '!bg-[#010f1c] !text-[#4c88e8] !border-[#001234]',
        warning: '!bg-[#1c1401] !text-[#f0c053] !border-[#342600]',
        error: '!bg-[#1c0101] !text-[#f05353] !border-[#340000]'
      }
    }}
    icons={{
      success: <Icons.check className="h-6 w-6 text-green-500" />,
      error: <Icons.error className="h-6 w-6 text-red-400" />,
      info: <Icons.info className="h-6 w-6 text-[#4c88e8]" />,
      warning: <Icons.warning className="h-6 w-6 text-orange-600" />,
      loading: <Icons.spinner className="h-5 w-5 text-gray-600" />
    }}
    {...props}
  />
);
