import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';

import { DropdownUser } from './dropdown-user';
import { MobileSide } from './mobile-side';
import { Sidenav } from './sidenav';

export default function PanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="bg-black-main fixed inset-0 flex min-h-full md:block">
      <div className="flex-basis flex min-h-full w-full grow justify-center md:h-full md:p-4">
        <aside className="z-3 fixed bottom-0 left-0 hidden h-[calc(100%-74px)] w-full shrink-0 flex-col overflow-hidden bg-gray-main md:relative md:bottom-auto md:left-auto md:flex md:h-[calc(100vh-32px)] md:w-60 md:rounded-sm">
          {/* Header side */}
          <div className="relative mt-6 flex items-center justify-between px-4">
            <div className="relative">
              <Link
                to="/"
                className="flex items-center justify-center text-xl dark:text-white"
              >
                {/* <Icons.apps  /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                  id="Champagne-Party-Alcohol--Streamline-Core"
                  height={14}
                  width={14}
                  className="mr-2 h-6 w-6"
                >
                  <path
                    id="Union"
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M3.208 0.574a0.75 0.75 0 0 1 0.907 -0.456l3.601 1.026a0.75 0.75 0 0 1 0.53 0.867L7.2 7.315a3.08 3.08 0 0 1 -3.117 2.482l-0.672 2.357 0.74 0.211a0.75 0.75 0 0 1 -0.411 1.443L2.313 13.4a0.75 0.75 0 0 1 -0.07 -0.02l-1.429 -0.407a0.75 0.75 0 1 1 0.412 -1.443l0.742 0.212 0.672 -2.357A3.08 3.08 0 0 1 1.3 5.633L3.207 0.574Zm0.481 2.974 2.574 0.766 0.378 -1.917 -2.273 -0.648 -0.679 1.799Zm6.313 6.321a3.082 3.082 0 0 1 -2.144 -0.868 4.32 4.32 0 0 0 0.567 -1.444l0.698 -3.539 1.479 -0.353 -0.631 -1.849 -0.462 0.116A2 2 0 0 0 8.987 0.517l1.288 -0.323a0.75 0.75 0 0 1 0.893 0.485l1.746 5.117a3.08 3.08 0 0 1 -1.457 3.707l0.596 2.377 0.745 -0.187a0.75 0.75 0 0 1 0.365 1.455l-1.443 0.362a0.711 0.711 0 0 1 -0.059 0.015l-1.449 0.364a0.75 0.75 0 0 1 -0.365 -1.455l0.751 -0.189 -0.596 -2.376Z"
                    clipRule="evenodd"
                    strokeWidth={1}
                  />
                </svg>
                <span className="font-bold">ZorzalApp</span>
              </Link>
            </div>
          </div>
          <Sidenav />

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

      <MobileSide sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>
  );
}
