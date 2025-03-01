import * as React from 'react';
import { useNavigate } from 'react-router-dom';

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
import { supportOptions } from '@/constants/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { ModalChangelog } from './modal-changelog';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { useModalStore } from '@/utils/modal/use-modal-store';

export function DropdownUser() {
  const navigate = useNavigate();
  const { user, logoutAction } = useAuthStore();
  const [open, setOpen] = React.useState(false);
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

  const handleLogout = async () => {
    // await logoutAction();
    openConfirm({
      title: 'Cerrar sesion',
      description: 'Estas seguro de cerrar sesion?',
      onConfirm: async () => {
        await logoutAction();
      }
    });
  };

  const handleChangelog = () => {
    setOpen(false);
    openModal({
      title: 'Registro de cambios',
      description: 'Mantente actualizado con los ultimos cambios de la app',
      content: <ModalChangelog />
    });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
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
            onClick={handleLogout}
            className="cursor-pointer text-left"
          >
            <Icons.logout className="mr-3 h-5 w-5" /> Salir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleChangelog}
            className="cursor-pointer text-left opacity-40 transition-opacity hover:opacity-100"
          >
            <Icons.info className="mr-3 h-5 w-5" />
            Version: {CONFIG.app.platformVersion}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
