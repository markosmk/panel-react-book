import * as z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRoleStore } from './use-role-store';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

const roleSchema = z.object({
  roles: z
    .array(
      z.object({
        id: z.number(),
        name: z
          .string()
          .min(3, 'El nombre debe tener al menos 3 caracteres')
          .regex(/^[a-zA-Z]+$/, 'El nombre debe contener solo letras')
          .max(50, 'El nombre no puede tener más de 50 caracteres')
      })
    )
    .superRefine((items, ctx) => {
      const lowerCaseNames = new Set<string>();
      for (const item of items) {
        const lowerCaseName = item.name.toLowerCase();
        if (lowerCaseNames.has(lowerCaseName)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El nombre del rol ya existe.',
            path: [
              items.findIndex((i) => i.name.toLowerCase() === lowerCaseName),
              'name'
            ]
          });
          return;
        }
        lowerCaseNames.add(lowerCaseName);
      }

      // const nameCounts = new Map<string, number>();
      // Contar las ocurrencias de cada nombre
      // for (const item of items) {
      //   const lowerCaseName = item.name.toLowerCase();
      //   nameCounts.set(lowerCaseName, (nameCounts.get(lowerCaseName) || 0) + 1);
      // }
      // Verificar duplicados y agregar errores
      // for (let i = 0; i < items.length; i++) {
      //   const lowerCaseName = items[i].name.toLowerCase();
      //   if (nameCounts.get(lowerCaseName)! > 1) {
      //     ctx.addIssue({
      //       code: z.ZodIssueCode.custom,
      //       message: 'Este nombre ya está en uso',
      //       path: [i, 'name'] // Asignar el error a la posición específica
      //     });
      //   }
      // }
    })
});

type RoleFormValues = z.infer<typeof roleSchema>;

export const RolesForm = ({ onClose }: { onClose: () => void }) => {
  const { roles, updateRoles } = useRoleStore();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { roles: roles }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles'
  });

  const onSubmit = (data: RoleFormValues) => {
    const updatedRoles = data.roles.map((role) => {
      const existingRole = roles.find((r) => r.name === role.name);
      const isNewRole = !existingRole;

      return {
        ...role,
        name: isNewRole ? role.name.toUpperCase() : role.name
      };
    });
    console.log(updatedRoles);
    updateRoles(updatedRoles);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              {...register(`roles.${index}.name`)}
              defaultValue={field.name}
            />
            <Button
              type="button"
              variant={'secondary'}
              size="icon"
              onClick={() => remove(index)}
              className="h-12 min-w-12"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          {errors.roles?.[index]?.name && (
            <p className="text-sm text-red-500">
              {errors.roles[index].name.message}
            </p>
          )}
        </div>
      ))}
      <div className="">
        <Button
          type="button"
          variant={'secondary'}
          onClick={() => append({ id: Date.now(), name: '' })}
        >
          Agregar Rol
        </Button>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
};
