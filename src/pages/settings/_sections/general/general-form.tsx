import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ButtonLoading } from '@/components/button-loading';
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

import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SettingsApp } from '@/types/app.types';

const formSchema = z.object({
  phoneWhatsapp: z
    .string()
    .trim()
    .min(1, 'El campo no puede estar vacio')
    .min(8, 'El campo debe tener al menos 8 caracteres')
    .max(20, 'El campo no puede tener más de 20 caracteres'),
  email: z
    .string()
    .email()
    .min(1, 'El campo no puede estar vacio')
    .max(150, 'El campo no puede tener más de 150 caracteres'),
  aditionalNote: z
    .string()
    .trim()
    .min(1, 'El campo no puede estar vacio')
    .min(10, 'El campo debe tener al menos 10 caracteres')
    .max(200, 'El campo no puede tener más de 200 caracteres'),
  termsAndConditions: z
    .string()
    .trim()
    .min(1, 'El campo no puede estar vacio')
    .optional(),
  active: z.boolean(),
  messageDisabled: z
    .string()
    .trim()
    .min(10, 'El campo debe tener al menos 10 caracteres')
    .max(200, 'El campo no puede tener más de 200 caracteres')
    .optional()
});

export type FormValues = z.infer<typeof formSchema>;

export function GeneralForm({
  data,
  isPending,
  onSubmit
}: {
  data?: SettingsApp;
  isPending: boolean;
  mutateAsync?: () => Promise<void>;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneWhatsapp: data?.phoneWhatsapp || '',
      email: data?.email || '',
      aditionalNote: data?.aditionalNote || '',
      active: data?.active == '1' ? true : false,
      messageDisabled: data?.messageDisabled || ''
    },
    mode: 'onChange'
  });

  const watchActive = form.watch('active');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phoneWhatsapp"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">
                    Número de Contacto
                  </FormLabel>
                  <FormDescription>
                    El número de Whatsapp al que el cliente podrá comunicarse
                    para terminar de confirmar su reserva.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input placeholder="Ej: +5493404040032" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">
                    Correo Electrónico
                  </FormLabel>
                  <FormDescription>
                    El email en el que recibirás un mensaje cuando un cliente
                    realize una reserva.
                  </FormDescription>
                </div>
                <FormControl>
                  <Input placeholder="Ej: usuario@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aditionalNote"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">Notas Adicionales</FormLabel>
                  <FormDescription>
                    Antes de finalizar la reserva, y antes que el cliente envie
                    un mensaje por whatsapp puedes mostrar esta nota adicional.
                  </FormDescription>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Para confirmar tu reserva..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">Pausar Reservas</FormLabel>
                  <FormDescription>
                    Si se activa, los clientes no podrán realizar reservas. Esto
                    te permite pausar las reservas cuando quieras.
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

          {watchActive && (
            <FormField
              control={form.control}
              name="messageDisabled"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5 pr-2">
                    <FormLabel className="text-base">
                      Mensaje Personalizado
                    </FormLabel>
                    <FormDescription>
                      El mensaje que se mostrará en el panel cuando las reservas
                      esten deshabilitadas
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <ButtonLoading type="submit" isWorking={isPending}>
          Guardar Cambios
        </ButtonLoading>
      </form>
    </Form>
  );
}
