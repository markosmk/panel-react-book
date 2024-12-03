import { ButtonLoading } from '@/components/button-loading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { useLogin } from '@/routes/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo válido.' }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.'
  })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const { loginAction } = useAuth();
  const { mutateAsync, isPending } = useLogin();
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      await mutateAsync(data, {
        onSuccess: (data) => {
          console.log('login', data);
          if (data) {
            loginAction(data.user, data?.token ?? undefined);
          }
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ej: usuario@gmail.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ButtonLoading
            isWorking={isPending}
            className="!w-full"
            type="submit"
          >
            Ingresar
          </ButtonLoading>
        </form>
      </Form>
    </>
  );
}
