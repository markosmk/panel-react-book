import { ButtonLoading } from './button-loading';
import { Button } from './ui/button';

export function ButtonDelete({
  isDeleting,
  readyToDelete,
  setReadyToDelete,
  handleDelete,
  isDisabled,
  children = <>Eliminar</>
}: {
  isDeleting: boolean;
  readyToDelete: boolean;
  setReadyToDelete: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  isDisabled?: boolean;
  children?: React.ReactNode;
}) {
  return isDeleting ? (
    <div className="flex min-h-12 items-center">
      <p className="text-sm italic text-muted-foreground">
        Eliminando... Un momento
      </p>
    </div>
  ) : (
    <div>
      {readyToDelete ? (
        <div className="flex min-h-12 items-center gap-x-2">
          <p className="text-sm">Estas seguro?</p>
          <Button
            type="button"
            size={'sm'}
            variant={'destructive'}
            onClick={handleDelete}
          >
            Si
          </Button>
          <Button
            type="button"
            size={'sm'}
            variant={'secondary'}
            onClick={() => setReadyToDelete(false)}
          >
            No
          </Button>
        </div>
      ) : (
        <ButtonLoading
          type="button"
          variant="destructive"
          onClick={() => setReadyToDelete(true)}
          disabled={isDisabled}
        >
          {children}
        </ButtonLoading>
      )}
    </div>
  );
}
