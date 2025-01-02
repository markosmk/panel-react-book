import { ButtonLoading } from '@/components/button-loading';
import { Alert } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
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

type UserFormData = z.infer<typeof formSchema>;
type UserFormValue = UserFormData & {
  emailOrPassword?: {
    message: string;
  };
};

const defaultValues = {
  email: '',
  password: ''
};

export default function UserAuthForm() {
  const { loginAction } = useAuth();
  const { mutateAsync, isPending } = useLogin();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      await mutateAsync(data, {
        onSuccess: (data) => {
          if (data) {
            loginAction(data.user, data?.token ?? undefined);
          }
        }
      });
    } catch (error) {
      form.setError('emailOrPassword', {
        message: 'El correo o la contraseña son incorrectas.'
      });
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
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors('emailOrPassword');
                    }}
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
                  <InputPassword
                    type="password"
                    placeholder="******"
                    disabled={isPending}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors('emailOrPassword');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors?.emailOrPassword && (
            <Alert
              variant="destructive"
              className="my-2 text-[0.8rem] font-medium"
            >
              {form.formState.errors.emailOrPassword?.message?.toString() ?? ''}
            </Alert>
          )}

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
