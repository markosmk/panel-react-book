import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CustomerTable } from '@/types/customer.types';
import { useCreateEditCustomer } from '@/services/hooks/customer.mutation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ButtonLoading } from '@/components/button-loading';
import { CardForm } from '@/components/card-footer-action';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/notifications';
import { CONFIG } from '@/constants/config';

const baseSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede tener más de 190 caracteres'),
  email: z
    .string()
    .email('Correo electrónico inválido')
    .max(150, 'El correo no puede tener más de 150 caracteres'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido.')
    .regex(
      /^\d{8,30}$/,
      'El teléfono debe contener solo números y tener entre 8 y 30 caracteres'
    ),
  findAbout: z
    .enum([
      'wine',
      'friend',
      'hotel',
      'ads',
      'tripadvisor',
      'google',
      'social',
      'other'
    ])
    .or(z.literal(''))
    .optional(),
  customAbout: z
    .string()
    .max(250, 'El campo no puede tener más de 250 caracteres')
    .optional(),
  wantNewsletter: z.boolean(),
  origen: z
    .string()
    .max(250, 'El campo no puede tener más de 250 caracteres')
    .optional(),
  hotel: z
    .string()
    .max(250, 'El campo no puede tener más de 250 caracteres')
    .optional()
});

type FormValues = z.infer<typeof baseSchema>;

type FormChangeStatusProps = {
  data?: CustomerTable;
  closeModal: () => void;
};

const initialValues = {
  name: '',
  email: '',
  phone: '',
  findAbout: '',
  customAbout: '',
  origen: '',
  hotel: '',
  wantNewsletter: '0'
} as CustomerTable;

export function CustomerForm({
  data = initialValues,
  closeModal
}: FormChangeStatusProps) {
  // const isEditing = !!data.id;
  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: data?.name || '',
      email: data?.email || '',
      phone: data?.phone || '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findAbout: data?.findAbout || ('' as any),
      customAbout: data?.customAbout || '',
      wantNewsletter: data?.wantNewsletter === '1' ? true : false,
      origen: data?.origen || '',
      hotel: data?.hotel || ''
    }
  });

  const { mutateAsync, isPending } = useCreateEditCustomer();

  const handleSubmit = async (formValues: FormValues) => {
    toast.dismiss();

    await mutateAsync(
      {
        ...formValues,
        id: data?.id || '',
        wantNewsletter: formValues.wantNewsletter ? '1' : '0'
      },
      {
        onSuccess: () => {
          toast.success(
            data?.id
              ? 'Cliente actualizado correctamente.'
              : 'Cliente creado correctamente.'
          );
          setTimeout(() => {
            closeModal();
          }, 100);
        }
      }
    );
  };

  const handleCancel = () => {
    toast.dismiss();
    closeModal();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="relative space-y-2 sm:space-y-4"
      >
        <CardForm isPending={isPending}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel className="col-span-3 mt-4 sm:col-span-1" required>
                  Nombre
                </FormLabel>
                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <FormControl>
                    <Input placeholder="Ej: Maximiliano Paez" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel className="col-span-3 mt-4 sm:col-span-1" required>
                  Correo Electronico
                </FormLabel>
                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <FormControl>
                    <Input placeholder="Ej: cliente@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel className="col-span-3 mt-4 sm:col-span-1" required>
                  Telefono
                </FormLabel>
                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <FormControl>
                    <Input placeholder="Ej: 54968677575" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origen"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                  Lugar de Residencia
                </FormLabel>
                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <FormControl>
                    <Input placeholder="Ej: Mendoza, Argentina" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotel"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                  Tipo Hospedaje
                </FormLabel>
                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <FormControl>
                    <Input placeholder="Ej: Airbnb" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wantNewsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    Le gustaria recibir Noticias (Newsletter)?
                  </FormLabel>
                  <FormDescription>
                    permite recibir novedades sobre {CONFIG.app.name} en su
                    email.
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
          <ButtonLoading
            type="submit"
            isWorking={isPending}
            disabled={!form.formState.isDirty}
          >
            {data?.id ? 'Actualizar Cambios' : 'Crear Nuevo'}
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
}
