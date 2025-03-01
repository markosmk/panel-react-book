import { LinkProps, NavLink as NavigateLink } from 'react-router-dom';
import { ChevronDownIcon } from 'lucide-react';

import { IconSVG } from '@/components/icons';
import { cn } from '@/lib/utils';

type NavLinkProps = LinkProps & {
  icon?: IconSVG;
  children: React.ReactNode;
  disabled?: boolean;
  isExpanded?: boolean;
  hasSubmenu?: boolean;
};

export function NavLink({
  children,
  to,
  icon: Icon,
  disabled,
  className,
  isExpanded,
  hasSubmenu,
  ...props
}: NavLinkProps) {
  return (
    <div
      className={cn(
        'group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        disabled && 'pointer-events-none select-none opacity-50',
        isExpanded && 'pointer-events-none select-none'
      )}
    >
      {!hasSubmenu ? (
        <NavigateLink to={to} end {...props}>
          {({ isActive }) => (
            <div
              className={cn(
                'relative mb-1 flex cursor-pointer flex-col rounded-md bg-transparent px-3 py-2.5 text-base transition-transform duration-200 active:scale-[.97]',
                isActive ? 'bg-gray-active' : 'text-muted-foreground',
                disabled && 'pointer-events-none select-none opacity-50',
                className
              )}
            >
              <div className="absolute inset-0 scale-75 rounded-md bg-gray-active opacity-0 transition-transform duration-200 ease-in-out group-hover:animate-scale-in" />
              <div className="z-[1] flex w-full items-center overflow-auto transition-colors duration-200 ease-in-out group-hover:text-accent-foreground">
                {/* mark active */}
                {isActive && (
                  <div className="visible absolute left-0 h-6 w-1 animate-scale-in rounded-md bg-primary" />
                )}
                {Icon && (
                  <div className="ml-[0.1rem] mr-3 flex size-5 flex-shrink-0 items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                )}
                <span className="flex-grow truncate text-left capitalize">
                  {children}
                </span>
              </div>
            </div>
          )}
        </NavigateLink>
      ) : (
        <button
          type="button"
          role="button"
          aria-label="Open submenu"
          className="w-full"
        >
          <div
            className={cn(
              'relative mb-1 flex cursor-pointer flex-col rounded-md bg-transparent px-3 py-2.5 text-base transition-transform duration-200 active:scale-[.97]',
              isExpanded ? 'bg-transparent' : 'text-muted-foreground',
              disabled && 'pointer-events-none select-none opacity-50',
              className
            )}
          >
            {!isExpanded && (
              <div className="absolute inset-0 scale-75 rounded-md bg-gray-active opacity-0 transition-transform duration-200 ease-in-out group-hover:animate-scale-in" />
            )}
            <div className="z-[1] flex w-full items-center overflow-auto transition-colors duration-200 ease-in-out group-hover:text-accent-foreground">
              {/* mark active */}
              {isExpanded && (
                <div className="visible absolute left-0 h-6 w-1 animate-scale-in rounded-md bg-primary" />
              )}
              {Icon && (
                <div className="ml-[0.1rem] mr-3 flex size-5 flex-shrink-0 items-center justify-center">
                  <Icon className="size-5" />
                </div>
              )}
              <span className="flex-grow truncate text-left capitalize">
                {children}
              </span>
              <div
                className={cn(
                  'absolute right-3 transition-transform duration-300',
                  isExpanded ? 'rotate-0' : '-rotate-90'
                )}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
