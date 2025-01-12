import { MoreHorizontalIcon } from 'lucide-react';

import { cn, formatDateOnly, formatPrice } from '@/lib/utils';
import { useModal } from '@/hooks/use-modal';
import { useMediaQuery } from '@/hooks/use-media-query';

import { TooltipHelper } from '@/components/tooltip-helper';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/notifications';
import { Additional } from '@/types/app.types';
import { DialogConfirm } from '@/components/dialog-confirm';
import * as React from 'react';
import {
  useAdditionalDelete,
  useCreateEditAdditional
} from '@/services/hooks/additional.mutation';
import { ButtonLoading } from '@/components/button-loading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { InputNumber } from '@/components/ui/input-number';
import { Switch } from '@/components/ui/switch';
import { CardForm } from '@/components/card-footer-action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

function ItemInfo({
  label,
  value,
  className
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('col-span-1 space-y-1', className)}>
      <p className="text-xs text-muted-foreground">{label}:</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function DetailModal({ detail }: { detail: Additional }) {
  return (
    <div className="relative flex flex-col gap-2">
      <div className="my-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información en Detalle
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-2 gap-2">
                <ItemInfo
                  label="Nombre"
                  value={detail.name}
                  className="col-span-2"
                />
                <ItemInfo
                  label="Descripcion"
                  value={detail.description}
                  className="col-span-2"
                />
                <ItemInfo
                  label="Precio"
                  value={formatPrice(Number(detail.price))}
                />
                <ItemInfo label="disponibilidad" value={detail.availability} />

                <ItemInfo label="Estado" value={detail.active} />
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

const baseSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(190, 'El nombre no puede tener más de 190 caracteres'),
  name_en: z
    .string()
    .max(190, 'El nombre no puede tener más de 190 caracteres')
    .optional()
    .or(z.literal('')),
  name_pt: z
    .string()
    .max(190, 'El nombre no puede tener más de 190 caracteres')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .max(190, 'La descripción no puede tener más de 190 caracteres'),
  description_en: z
    .string()
    .max(190, 'La descripción no puede tener más de 190 caracteres.')
    .optional()
    .or(z.literal('')),
  description_pt: z
    .string()
    .max(190, 'La descripción no puede tener más de 190 caracteres.')
    .optional()
    .or(z.literal('')),
  price: z.coerce.number().min(1, 'El precio no es valido.'),
  availability: z.boolean(),
  active: z.boolean()
});

type FormValues = z.infer<typeof baseSchema>;

type FormChangeStatusProps = {
  data?: Additional;
  closeModal: () => void;
};

const initialValues = {
  name: '',
  description: '',
  price: '0',
  availability: '0',
  active: '1',
  translations: [],
  id: '',
  created_at: '',
  updated_at: ''
} as Additional;

export function FormAdditional({
  data = initialValues,
  closeModal
}: FormChangeStatusProps) {
  const isEditing = !!data.id;
  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: data?.name || '',
      name_en:
        data.translations?.find((item) => item?.language === 'en')?.name || '',
      name_pt:
        data.translations?.find((item) => item?.language === 'pt')?.name || '',
      description: data?.description || '',
      description_en:
        data.translations?.find((item) => item?.language === 'en')
          ?.description || '',
      description_pt:
        data.translations?.find((item) => item?.language === 'pt')
          ?.description || '',
      price: (data?.price && Number(data?.price)) || 0,
      availability: data?.availability === '1' ? true : false,
      active: data?.active === '1' ? true : false
    }
  });

  const hasUnsavedChanges = React.useMemo(
    () => form.formState.isDirty,
    [form.formState.isDirty]
  );

  const { mutateAsync, isPending } = useCreateEditAdditional();

  const handleSubmit = async (formValues: FormValues) => {
    toast.dismiss();

    const translations = [
      {
        language: 'en',
        name: formValues.name_en || '',
        description: formValues.description_en || ''
      },
      {
        language: 'pt',
        name: formValues.name_pt || '',
        description: formValues.description_pt || ''
      }
    ].filter((translation) => translation.name || translation.description);

    await mutateAsync(
      {
        ...formValues,
        id: data ? data.id : null,
        price: formValues.price.toString(),
        availability: formValues.availability ? '1' : '0',
        active: formValues.active ? '1' : '0',
        translations
      },
      {
        onSuccess: (data) => {
          const message = data?.data?.message;

          toast.success(message || 'Item actualizado correctamente.');
          setTimeout(() => {
            closeModal();
          }, 150);
        }
      }
    );
  };

  const handleCancel = () => {
    toast.dismiss();
    if (isEditing && hasUnsavedChanges) {
      toast.warning('Tienes cambios sin guardar.');
      return;
    }
    closeModal();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="relative space-y-2 sm:space-y-4"
      >
        <CardForm isPending={isPending}>
          <Tabs defaultValue="spanish" className="">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Nombre</Label>
              <TabsList className="mr-4 inline w-[100px]">
                <TabsTrigger
                  value="spanish"
                  className="mx-0 -mb-0 select-none py-0"
                >
                  Es
                </TabsTrigger>
                <TabsTrigger
                  value="english"
                  className="mx-0 -mb-0 select-none py-0"
                >
                  En
                </TabsTrigger>
                <TabsTrigger
                  value="portuguese"
                  className="mx-0 -mb-0 select-none py-0"
                >
                  Pt
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish" className="mt-0">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Degustacion Malbec"
                        type="text"
                        {...field}
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="english" className="mt-0">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Degustation Malbec"
                        type="text"
                        {...field}
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="portuguese" className="mt-0">
              <FormField
                control={form.control}
                name="name_pt"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Degustacao Malbec"
                        type="text"
                        {...field}
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Degustacion Malbec" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Tabs defaultValue="spanish" className="">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Descripción Breve</Label>
              <TabsList className="mr-4 inline w-[100px]">
                <TabsTrigger
                  value="spanish"
                  className="mx-0 -mb-0 select-none py-0"
                >
                  Es
                </TabsTrigger>
                <TabsTrigger
                  value="english"
                  className="mx-0 -mb-0 select-none py-0"
                >
                  En
                </TabsTrigger>
                <TabsTrigger
                  value="portuguese"
                  className="mx-0 -mb-0 select-none py-0"
                >
                  Pt
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish" className="mt-0">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Duracion de 10 a 20 minutos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="english" className="mt-0">
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Duration of 10 to 20 minutes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="portuguese" className="mt-0">
              <FormField
                control={form.control}
                name="description_pt"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Duracao de 10 a 20 minutos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          {/* <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Descripcion</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Duracion de 10 a 20 minutos"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Precio</FormLabel>
                <FormControl>
                  <InputNumber placeholder="43000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Disponiblidad Inmediata?</FormLabel>
                  <FormDescription>
                    Si <b>NO</b> tiene disponiblidad inmediata, se mostrará en
                    la web el mensaje <i>"(Sujeto a disponibilidad)"</i>.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Estado</FormLabel>
                  <FormDescription>
                    Permitir que este visible en la web, y los clientes puedan
                    solicitarlo.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardForm>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isPending || form.formState.isSubmitting}
          >
            Cancelar
          </Button>
          <ButtonLoading type="submit" isWorking={isPending}>
            {data?.id ? 'Actualizar Cambios' : 'Crear Nuevo'}
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
}

export function DataTableActions({ data }: { data: Additional }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModal();
  const { mutateAsync, isPending } = useAdditionalDelete();
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles Item',
      description: 'registro creado el ' + formatDateOnly(data.created_at),
      component: <DetailModal detail={data} />
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Editar Item',
      description: 'ultima actualizacion el ' + formatDateOnly(data.updated_at),
      component: <FormAdditional data={data} closeModal={closeModal} />
    });
  };

  const handleDelete = async () => {
    await mutateAsync(data.id, {
      onSuccess: (data) => {
        const message = data?.data?.message;
        toast.success(message || 'Item eliminado correctamente.');
        setTimeout(() => {
          setOpenDialogDelete(false);
        }, 150);
      }
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Ver Item">
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Editar">
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenEdit}
            title="Editar"
          >
            <Icons.edit className="h-4 w-4" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpenDialogDelete(true)}
            title="Eliminar"
          >
            <Icons.remove className="h-4 w-4" />
          </Button>
        </TooltipHelper>
      </div>

      {isMobile && (
        <div className="inline-flex sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 data-[state=open]:bg-background"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
                <Icons.copy className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDialogDelete(true)}>
                <Icons.remove className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <DialogConfirm
        title={`¿Seguro que quieres Eliminar?`}
        description={`Esta acción no se puede deshacer.\nHaz click en "Si, Continuar" para eliminar el item.`}
        onConfirm={handleDelete}
        isOpen={openDialogDelete}
        onOpenChange={setOpenDialogDelete}
        isProcessing={isPending}
      />
    </>
  );
}
