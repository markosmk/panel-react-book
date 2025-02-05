import { IconSVG } from '@/components/icons';
import { cn } from '@/lib/utils';
import { LinkProps, NavLink as NavigateLink } from 'react-router-dom';

export function NavLink({
  children,
  to,
  icon: Icon,
  disabled,
  className,
  ...props
}: LinkProps & {
  icon: IconSVG;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <NavigateLink
      to={to}
      className={cn(
        'group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        disabled && 'pointer-events-none select-none opacity-50',
        className
      )}
      {...props}
    >
      {({ isActive }) => {
        return (
          <div
            className={cn(
              'relative mb-1 flex cursor-pointer flex-col rounded-md bg-transparent px-3 py-2.5 text-base transition-transform duration-200 active:scale-[.97]',
              // hover:bg-gray-active hover:text-accent-foreground
              isActive && 'bg-gray-active',
              !isActive && 'text-muted-foreground',
              disabled && 'pointer-events-none select-none opacity-50'
            )}
          >
            {/* <div className="absolute inset-0 scale-75 rounded-md bg-gray-active opacity-0 transition-transform duration-200 group-hover:scale-100 group-hover:opacity-100"></div> */}
            <div className="absolute inset-0 scale-75 rounded-md bg-gray-active opacity-0 transition-transform duration-200 ease-in-out group-hover:animate-scale-in"></div>

            <div
              className={cn(
                'z-[1] flex w-full items-center overflow-auto transition-colors duration-200 ease-in-out group-hover:text-accent-foreground'
              )}
            >
              {/* mark active */}
              {isActive && (
                <div className="visible absolute left-0 h-6 w-1 animate-scale-in rounded-md bg-primary"></div>
              )}
              <div className="ml-[0.1rem] mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <span className="flex-grow truncate text-left capitalize">
                {children}
              </span>
            </div>
          </div>
        );
      }}
    </NavigateLink>
  );
}
