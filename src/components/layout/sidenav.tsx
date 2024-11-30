import { cn } from '@/lib/utils';
import { adminNavigation } from '@/constants/navigation';

import { NavLink } from './nav-link';

export function Sidenav() {
  return (
    <nav className="nav-content scroller relative mt-3 w-full px-4 sm:mt-6">
      <div className={cn('block')}>
        <ul>
          {adminNavigation.map(({ icon: Icon, ...item }) => (
            <NavLink
              key={item.name}
              to={item.href}
              icon={Icon}
              disabled={item.disabled}
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </div>
    </nav>
  );
}
