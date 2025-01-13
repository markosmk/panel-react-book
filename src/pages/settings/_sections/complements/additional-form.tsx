import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateEditAdditional } from '@/services/hooks/additional.mutation';
import { Additional } from '@/types/app.types';

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
import { InputNumber } from '@/components/ui/input-number';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs-basic';
import { Label } from '@/components/ui/label';
import { ButtonLoading } from '@/components/button-loading';
import { CardForm } from '@/components/card-footer-action';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/notifications';

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

export function AdditionalForm({
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
          <Tabs defaultValue="spanish">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Nombre</Label>
              <TabsList>
                <TabsTrigger value="spanish">Es</TabsTrigger>
                <TabsTrigger value="english">En</TabsTrigger>
                <TabsTrigger value="portuguese">Pt</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish">
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
            <TabsContent value="english">
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
            <TabsContent value="portuguese">
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

          <Tabs defaultValue="spanish">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Descripción Breve</Label>
              <TabsList>
                <TabsTrigger value="spanish">Es</TabsTrigger>
                <TabsTrigger value="english">En</TabsTrigger>
                <TabsTrigger value="portuguese">Pt</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish">
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
            <TabsContent value="english">
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
            <TabsContent value="portuguese">
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
