import * as React from 'react';

import { DialogConfirm } from '@/components/dialog-confirm';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CONFIG } from '@/constants/config';
import { useAuth } from '@/providers/auth-provider';
import { useNavigate } from 'react-router-dom';
import { supportOptions } from '@/constants/navigation';

export function DropdownUser() {
  const navigate = useNavigate();
  const { user, logoutAction, isClosing } = useAuth();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="w-full justify-start">
            <Icons.dotCircle className="mr-3 inline-flex h-5 w-5" />
            Opciones
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-[calc(15rem-2rem)] p-2"
        >
          <div className="px-2 py-1 text-xs text-muted-foreground/60">
            {user?.email}
          </div>
          <DropdownMenuItem
            onClick={() => navigate('/settings')}
            className="cursor-pointer text-left"
          >
            <Icons.settings className="mr-3 h-5 w-5" /> Configuración
          </DropdownMenuItem>
          {supportOptions.map(
            ({ icon: Icon, name, href, disabled = false }, idx) => (
              <DropdownMenuItem
                key={name + idx}
                className="flex w-full cursor-pointer gap-x-3"
                disabled={disabled}
                onClick={() => {
                  if (
                    href.startsWith('mailto:') ||
                    href.startsWith('tel:') ||
                    href.startsWith('http')
                  ) {
                    window.open(href, '_blank');
                  } else {
                    navigate(href);
                  }
                }}
                aria-label={`Ir a ${name}`}
                title={`Ir a ${name}`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <div className="flex-1 truncate text-sm">{name}</div>
              </DropdownMenuItem>
            )
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer text-left"
          >
            <Icons.logout className="mr-3 h-5 w-5" /> Salir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="flex w-full select-none items-center px-2 py-1.5 text-sm text-muted-foreground/50">
            <Icons.info className="mr-3 h-5 w-5" />
            Version: {CONFIG.app.platformVersion}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogConfirm
        title="¿Seguro que quieres salir?"
        description="Tus cambios se perderán si dejas la página."
        onConfirm={handleLogout}
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        isProcessing={isClosing}
      />
    </>
  );
}
