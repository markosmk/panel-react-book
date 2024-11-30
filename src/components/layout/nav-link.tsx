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
        className,
        disabled && 'pointer-events-none select-none opacity-50'
      )}
      {...props}
    >
      {({ isActive }) => {
        return (
          <>
            <li
              className={cn(
                'group relative mb-1 flex cursor-pointer flex-col rounded-md bg-transparent px-3 py-2.5 text-base transition-all duration-100 hover:bg-gray-active hover:text-accent-foreground',
                isActive && 'bg-gray-active',
                !isActive && 'text-muted-foreground',
                disabled && 'pointer-events-none select-none opacity-50'
              )}
            >
              <button
                type="button"
                role="menuitem"
                className={cn('flex w-full items-center overflow-auto')}
                disabled={disabled}
              >
                {/* mark */}
                {isActive && (
                  <div className="visible absolute left-0 h-6 w-1 animate-scale-in rounded-md bg-primary"></div>
                )}
                <div className="ml-[0.1rem] mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <span className="flex-grow truncate text-left capitalize">
                  {children}
                </span>
              </button>
            </li>
          </>
        );
      }}
    </NavigateLink>
  );
}
