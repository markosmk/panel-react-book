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
import { InputPassword } from '@/components/ui/input-password';

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'El campo no puede estar vacio')
      .max(30, 'El campo no puede tener más de 30 caracteres'),
    username: z
      .string()
      .trim()
      .min(1, 'El campo no puede estar vacio')
      .regex(/^[a-zA-Z0-9]+$/, 'El campo debe contener solo letras y numeros')
      .max(30, 'El campo no puede tener más de 30 caracteres')
      .optional(),
    email: z
      .string()
      .email()
      .min(1, 'El campo no puede estar vacio')
      .max(150, 'El campo no puede tener más de 150 caracteres'),
    password: z
      .string()
      .min(1, 'El campo no puede estar vacio')
      .min(6, 'El campo debe tener al menos 6 caracteres')
      .max(30, 'El campo no puede tener más de 30 caracteres'),
    newPassword: z
      .string()
      .min(6, 'El campo debe tener al menos 6 caracteres')
      .max(30, 'El campo no puede tener más de 30 caracteres')
      .or(z.literal(''))
      .optional(),
    confirmNewPassword: z
      .string()
      .min(6, 'El campo debe tener al menos 6 caracteres')
      .max(30, 'El campo no puede tener más de 30 caracteres')
      .or(z.literal(''))
      .optional()
  })
  .refine(
    (data) => {
      // Verifica si existe newPassword
      if (data.newPassword) {
        // Si newPassword existe, confirmNewPassword también debe existir y coincidir
        return data.confirmNewPassword === data.newPassword;
      }
      return true; // Si newPassword no existe, no hay validación
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmNewPassword']
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) {
        // Si newPassword existe, debe ser diferente a password
        return data.newPassword !== data.password;
      }
      return true;
    },
    {
      message: 'La nueva contraseña debe ser diferente a la antigua.',
      path: ['newPassword']
    }
  );

export type FormValues = z.infer<typeof formSchema>;

export function UserDataForm({
  data,
  isPending,
  onSubmit
}: {
  data: { email: string; username?: string; name?: string };
  isPending: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email,
      username: data?.username ?? '',
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onChange'
  });

  const onSubmitHandler = async (values: FormValues) => {
    await onSubmit(values).finally(() => {
      form.setValue('password', '');
      form.setValue('newPassword', '');
      form.setValue('confirmNewPassword', '');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Gonzalo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <hr className="-mx-4 md:-mx-6" />
          <div>
            <p className="text-xl font-semibold">Datos de Ingreso</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Credenciales que permiten el acceso a la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: usuario@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: usuario"
                      {...field}
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="-mx-4 md:-mx-6" />
          <div>
            <p className="text-xl font-semibold">Cambio de Contraseña</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Si no deseas cambiar la contraseña, puedes dejarla en blanco
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nueva Contraseña</FormLabel>
                  <FormControl>
                    <InputPassword
                      type="password"
                      placeholder="******"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Confirmar Nueva Contraseña
                  </FormLabel>
                  <FormControl>
                    <InputPassword
                      type="password"
                      placeholder="******"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="-mx-4 md:-mx-6" />
          <div>
            {/* <p className="text-xl font-semibold">Configuración General</p> */}
            <p className="mb-2 mt-1 text-muted-foreground">
              Es necesario ingresar tu contraseña actual para realizar cambios
            </p>
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">Contraseña Actual</FormLabel>
                </div>
                <FormControl>
                  <InputPassword
                    type="password"
                    placeholder="******"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading type="submit" isWorking={isPending}>
          Guardar Cambios
        </ButtonLoading>
      </form>
    </Form>
  );
}
