import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ButtonLoading } from '@/components/button-loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Role, UserTable } from '@/types/user.types';
import { useEditOrCreateUser } from '@/services/hooks/user.mutation';
import { InputPassword } from '@/components/ui/input-password';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from '@/components/notifications';

const baseUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
  email: z.string().email('Correo electrónico inválido'),
  role: z.enum([Role.ADMIN, Role.SUPERADMIN], {
    required_error: 'El rol es obligatorio',
    invalid_type_error: 'El rol es obligatorio'
  })
});

const createUserSchema = baseUserSchema.extend({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const updateUserSchema = baseUserSchema.extend({
  password: z.string().optional()
});

type FormChangeStatusProps = {
  data: UserTable | null;
  closeModal: () => void;
};

export function FormUser({ data, closeModal }: FormChangeStatusProps) {
  const isEditing = !!data;
  const schema = isEditing ? updateUserSchema : createUserSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name || '',
      username: data?.username || '',
      email: data?.email || '',
      password: '',
      role: data?.role || Role.ADMIN
    }
  });
  const hasUnsavedChanges = React.useMemo(
    () => form.formState.isDirty,
    [form.formState.isDirty]
  );
  const { mutateAsync, isPending } = useEditOrCreateUser();

  const handleSaveChanges = async (formValues: z.infer<typeof schema>) => {
    toast.dismiss();
    await mutateAsync(
      {
        ...formValues,
        id: data ? data.id : null,
        role: formValues.role as Role,
        password: formValues.password ?? ''
      },
      {
        onSuccess: () => {
          toast.success('Usuario actualizado correctamente.');
          setTimeout(() => {
            closeModal();
          }, 100);
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
        onSubmit={form.handleSubmit(handleSaveChanges)}
        className="space-y-2 sm:space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 gap-2 space-y-0">
              <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                Nombre
              </FormLabel>
              <div className="col-span-3 space-y-1 sm:col-span-2">
                <FormControl>
                  <Input placeholder="Ej: Lionel Messi" {...field} />
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
              <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                Correo Electronico
              </FormLabel>
              <div className="col-span-3 space-y-1 sm:col-span-2">
                <FormControl>
                  <Input placeholder="Ej: liomessi23@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 gap-2 space-y-0">
              <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                Nombre de Usuario
              </FormLabel>

              <div className="col-span-3 space-y-1 sm:col-span-2">
                <FormControl>
                  <Input placeholder="Ej: liomessi" {...field} />
                </FormControl>
                {isEditing && (
                  <FormDescription className="col-span-3 sm:col-span-2 sm:col-start-2">
                    No modifiques este campo, a menos que sea absolutamente
                    necesario.
                  </FormDescription>
                )}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 gap-2 space-y-0">
              <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                Rol de Usuario
              </FormLabel>

              <div className="col-span-3 space-y-1 sm:col-span-2">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Cambiar Rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                    <SelectItem value={Role.SUPERADMIN}>Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 gap-2 space-y-0">
              <FormLabel className="col-span-3 mt-4 sm:col-span-1">
                Contraseña
              </FormLabel>
              <div className="col-span-3 space-y-1 sm:col-span-2">
                <FormControl>
                  <InputPassword placeholder="Ej: ******" {...field} />
                </FormControl>
                {isEditing && (
                  <FormDescription className="col-span-3 sm:col-span-2 sm:col-start-2">
                    Completa este campo solo si quieres cambiar la contraseña
                    actual del usuario.
                  </FormDescription>
                )}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="grid gap-4 border-t">
          {isEditing && (
            <p className="mt-4 text-sm text-muted-foreground">
              Los cambios se reflejarán en la próxima vez que el usuario inicie
              sesion.
            </p>
          )}
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isPending || form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <ButtonLoading type="submit" isWorking={isPending}>
              Guardar Cambios
            </ButtonLoading>
          </div>
        </div>
      </form>
    </Form>
  );
}
