import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { DropdownUser } from './dropdown-user';
import { Sidenav } from './sidenav';

type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};
export function MobileSide({
  setSidebarOpen,
  sidebarOpen
}: TMobileSidebarProps) {
  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="!max-w-60 bg-gray-main !px-0"
          aria-describedby={undefined}
        >
          <SheetTitle hidden>Navigation</SheetTitle>
          <aside className="relative bottom-auto left-auto flex h-[calc(100vh-32px)] w-full shrink-0 flex-col overflow-auto md:w-60 md:rounded-sm">
            {/* Header side */}
            <div className="relative mb-2 mt-6 flex items-center justify-between px-4">
              <div className="relative w-full px-4">
                <Link
                  to="/"
                  className="justify flex items-center justify-start text-xl dark:text-white"
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

            <div className="mt-auto p-4 pt-2">
              <DropdownUser />
            </div>
          </aside>
        </SheetContent>
      </Sheet>
    </>
  );
}
