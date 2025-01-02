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
import { CardForm, CardFormFooter } from '@/components/card-footer-action';

const formSchema = z
  .object({
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
      .min(50, 'El campo debe tener al menos 50 caracteres')
      .max(240, 'El campo no puede tener más de 240 caracteres'),
    termsAndConditions: z
      .string()
      .trim()
      .min(50, 'El campo debe tener al menos 50 caracteres')
      .max(10000, 'El campo no puede tener más de 10000 caracteres')
      .optional()
      .or(z.literal('')),
    active: z.boolean(),
    messageDisabled: z
      .string()
      .trim()
      .min(50, 'El campo debe tener al menos 50 caracteres')
      .max(240, 'El campo no puede tener más de 240 caracteres')
      .optional()
      .or(z.literal(''))
  })
  .refine(
    (data) => {
      if (data.active) {
        return data.messageDisabled && data.messageDisabled.length > 0;
      }
      return true;
    },
    {
      message: 'El campo es necesario',
      path: ['messageDisabled']
    }
  );

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
      messageDisabled: data?.messageDisabled || '',
      termsAndConditions: data?.termsAndConditions || ''
    },
    mode: 'onChange'
  });

  const watchActive = form.watch('active');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <CardForm isPending={isPending}>
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
                    rows={3}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">
                    Términos y Condiciones de Reserva
                  </FormLabel>
                  <FormDescription>
                    Los terminos y condiciones de la reserva, esta informacion
                    se mostrará en la pagina de reservas.
                  </FormDescription>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Para confirmar tu reserva..."
                    rows={6}
                    className="resize-none"
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
                    <Textarea rows={3} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardForm>
        <CardFormFooter>
          <ButtonLoading type="submit" isWorking={isPending}>
            Guardar Cambios
          </ButtonLoading>
        </CardFormFooter>
      </form>
    </Form>
  );
}
