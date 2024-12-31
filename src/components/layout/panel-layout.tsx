import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';

import { DropdownUser } from './dropdown-user';
import { MobileSide } from './mobile-side';
import { Sidenav } from './sidenav';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function PanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="bg-black-main fixed inset-0 flex min-h-full md:block">
      <div className="flex-basis flex min-h-full w-full grow justify-center md:h-full md:p-4">
        <aside className="z-3 fixed bottom-0 left-0 hidden h-[calc(100%-74px)] w-full shrink-0 flex-col overflow-hidden bg-gray-main md:relative md:bottom-auto md:left-auto md:flex md:h-[calc(100vh-32px)] md:w-60 md:rounded-sm">
          {/* Header side */}
          <div className="relative mb-2 mt-6 flex items-center justify-between px-4">
            <div className="relative w-full px-4">
              <Link
                to="/"
                className="flex items-center justify-start rounded-md text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-8 focus-visible:ring-offset-gray-main dark:text-white"
              >
                <img
                  src="/assets/logo-app.png"
                  alt="Zorzal app"
                  className="w-40"
                />
                <span className="sr-only">ZorzalApp</span>
              </Link>
            </div>
          </div>
          <Sidenav />

          {/* <div className="p-4">
            <ThemeColorToggle />
          </div> */}

          <div className="p-4 pt-2">
            <DropdownUser />
          </div>
        </aside>
        {/* main content */}
        {/* TODO: ajust sm:-mr-4, in top level */}
        <div className="relative h-auto w-full grow md:-mr-4 md:ml-4 md:max-w-[calc(100%-240px)]">
          <main className="scroller flex h-full grow translate-x-0 flex-col overflow-y-auto overflow-x-hidden">
            {/* Burger sidebar */}
            <button
              className="p-4 text-gray-500 focus-visible:outline-none md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {children}
          </main>
        </div>
      </div>

      {/* mobile sidebar */}
      {isMobile && (
        <MobileSide sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
    </div>
  );
}
