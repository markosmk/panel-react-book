import { adminNavigation } from '@/constants/navigation';

import { NavLink } from './nav-link';

export function Sidenav() {
  return (
    <nav className="nav-content scroller relative mt-3 w-full px-4 sm:mt-6 sm:py-2">
      <div className="block">
        <ul>
          {adminNavigation.map(({ icon: Icon, ...item }) => (
            <li key={item.name}>
              <NavLink to={item.href} icon={Icon} disabled={item.disabled}>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
