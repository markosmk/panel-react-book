import * as React from 'react';
import { useLocation } from 'react-router-dom';
import type { NavigationItem } from '@/constants/navigation';
import type { Role } from '@/types/user.types';

import { adminNavigation } from '@/constants/navigation';
import { useAuthStore } from '@/stores/use-auth-store';

import { NavLink } from './nav-link';

export function Sidenav() {
  const { user } = useAuthStore();
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const currentPath = location.pathname;
    const matchingMenu = adminNavigation.find(({ submenu }) => {
      if (submenu) {
        return submenu.some((subItem) => subItem.href === currentPath);
      }
      return false;
    });

    if (matchingMenu) {
      setExpandedMenu(matchingMenu.name);
    } else {
      setExpandedMenu(null);
    }
  }, [location]);

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    hasSubmenu: boolean,
    name: string
  ) => {
    if (hasSubmenu) {
      event.preventDefault();
      event.stopPropagation();
      setExpandedMenu(expandedMenu === name ? null : name);
    } else {
      setExpandedMenu(null);
    }
  };

  const renderSubmenu = (submenu: NavigationItem[]) => (
    <ul className="pl-4">
      {submenu.map((subItem) => (
        <li key={subItem.name}>
          <NavLink
            to={subItem.href}
            disabled={subItem.disabled}
            className="mr-4 text-sm"
          >
            {subItem.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="nav-content scroller relative mt-3 w-full px-4 sm:mt-6 sm:py-2">
      <div className="block">
        <ul>
          {adminNavigation.map(({ icon: Icon, submenu, ...item }) => {
            if (item.role && user && !item.role.includes(user.role as Role))
              return null;

            const hasSubmenu = !!submenu;
            const isExpanded = expandedMenu === item.name;

            return (
              <li
                key={item.name}
                className={isExpanded ? 'rounded-lg bg-background pb-2' : ''}
              >
                <div
                  onClick={(e) => handleClick(e, hasSubmenu, item.name)}
                  className="cursor-pointer"
                >
                  <NavLink
                    to={hasSubmenu ? '#' : item.href}
                    icon={Icon}
                    disabled={item.disabled}
                    isExpanded={isExpanded}
                    hasSubmenu={hasSubmenu}
                    onClick={(e) => hasSubmenu && e.stopPropagation()}
                  >
                    {item.name}
                  </NavLink>
                </div>
                {hasSubmenu && isExpanded && renderSubmenu(submenu)}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
