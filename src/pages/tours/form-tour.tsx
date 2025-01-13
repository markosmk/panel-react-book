import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { toast } from '@/components/notifications';
import { Button } from '@/components/ui/button';
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
import { InputNumber } from '@/components/ui/input-number';
import { ButtonLoading } from '@/components/button-loading';
import { CardForm, CardFormFooter } from '@/components/card-footer-action';
import { Icons } from '@/components/icons';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs-basic';

import { useRouter } from '@/routes/hooks/use-router';
import { useCreateEditTour } from '@/services/hooks/tour.mutation';
import { Tour, TourRequest } from '@/types/tour.types';

const formSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(200, 'El nombre no puede tener más de 200 caracteres.'),
  name_en: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(200, 'El nombre no puede tener más de 200 caracteres.')
    .optional()
    .or(z.literal('')),
  name_pt: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(200, 'El nombre no puede tener más de 200 caracteres.')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(120, 'La descripción no puede tener más de 120 caracteres.'),
  description_en: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(120, 'La descripción no puede tener más de 120 caracteres.')
    .optional()
    .or(z.literal('')),
  description_pt: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(120, 'La descripción no puede tener más de 120 caracteres.')
    .optional()
    .or(z.literal('')),
  media: z
    .string()
    .url('La URL proporcionada no es válida.')
    .regex(
      /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i,
      'La URL debe terminar con alguna de estas extensiones: .jpg, .jpeg, .png, .gif, .webp.'
    )
    .optional()
    .or(z.literal('')),
  price: z.coerce.number().min(1, 'El precio no es valido.'),
  capacity: z.coerce.number().min(1, 'La capacidad no es valida.'),
  duration: z.string().min(1, 'La duracion debe tener al menos 10 caracteres.'),
  content: z
    .string()
    .min(10, 'El contenido debe tener al menos 10 caracteres.')
    .max(10000, 'El contenido no puede tener más de 10000 caracteres.'),
  content_en: z
    .string()
    .min(10, 'El contenido debe tener al menos 10 caracteres.')
    .max(10000, 'El contenido no puede tener más de 10000 caracteres.')
    .optional()
    .or(z.literal('')),
  content_pt: z
    .string()
    .min(10, 'El contenido debe tener al menos 10 caracteres.')
    .max(10000, 'El contenido no puede tener más de 10000 caracteres.')
    .optional()
    .or(z.literal('')),
  active: z.boolean()
});

type FormData = z.infer<typeof formSchema>;

type ExtendedFormData = FormData & {
  rangeTime?: {
    message: string;
  };
};

const initDefaultValues: Tour = {
  name: '',
  description: '',
  content: '',
  media: '',
  price: '0',
  capacity: '0',
  duration: '0',
  active: '1',
  id: '',
  created_at: '',
  updated_at: ''
};

// initDefaultValues

export function FormTour({
  data = initDefaultValues,
  isFetching = false,
  isNew = false
}: {
  data?: Tour;
  isFetching?: boolean;
  isNew?: boolean;
}) {
  const router = useRouter();
  const form = useForm<ExtendedFormData>({
    defaultValues: {
      name: data.name,
      name_en:
        data.translations?.find((item) => item?.language === 'en')?.name || '',
      name_pt:
        data.translations?.find((item) => item?.language === 'pt')?.name || '',
      description: data.description,
      description_en:
        data.translations?.find((item) => item?.language === 'en')
          ?.description || '',
      description_pt:
        data.translations?.find((item) => item?.language === 'pt')
          ?.description || '',
      content: data.content,
      content_en:
        data.translations?.find((item) => item?.language === 'en')?.content ||
        '',
      content_pt:
        data.translations?.find((item) => item?.language === 'pt')?.content ||
        '',
      media: data.media,
      price: parseFloat(data.price) || 0,
      capacity: parseFloat(data.capacity) || 0,
      duration: data.duration.toString() || '0',
      active: data.active === '1' ? true : false
    },
    resolver: zodResolver(formSchema)
  });
  const { mutateAsync, isPending } = useCreateEditTour();

  function onSubmit(values: FormData) {
    toast.dismiss();

    const translations = [
      {
        language: 'en',
        name: values.name_en || '',
        description: values.description_en || '',
        content: values.content_en || ''
      },
      {
        language: 'pt',
        name: values.name_pt || '',
        description: values.description_pt || '',
        content: values.content_pt || ''
      }
    ].filter(
      (translation) =>
        translation.name || translation.description || translation.content
    );

    const dataValues: TourRequest = {
      name: values.name,
      description: values.description,
      content: values.content,
      media: values.media || '',
      price: values.price.toFixed(2),
      capacity: values.capacity.toString(),
      duration: values.duration.toString(),
      active: values.active ? '1' : '0',
      translations: translations
    };

    mutateAsync(
      {
        id: !isNew ? data.id : null,
        data: { ...dataValues }
      },
      {
        onSuccess: () => {
          toast.success(
            `Tour ${!isNew ? 'Actualizado' : 'Creado'} correctamente.`
          );
          router.push('/tours');
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <CardForm isPending={isPending || isFetching}>
          <div className="flex flex-col space-y-1">
            <h4 className="text-lg font-semibold">Información General</h4>
            <p className="text-sm text-muted-foreground">
              Información que se mostrará en la página, al seleccionar y ver el
              detalle de un tour.
            </p>
          </div>

          {/* control 3 fields name */}
          <Tabs defaultValue="spanish">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Nombre</Label>
              <TabsList>
                <TabsTrigger value="spanish" focusId="name-spanish">
                  Es
                </TabsTrigger>
                <TabsTrigger value="english" focusId="name-english">
                  En
                </TabsTrigger>
                <TabsTrigger value="portuguese" focusId="name-portuguese">
                  Pt
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel htmlFor="name-spanish" className="sr-only">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tour Visita a la Bodega"
                        type="text"
                        {...field}
                        id="name-spanish"
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
                    <FormLabel htmlFor="name-english" className="sr-only">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tour Visit to the Winery"
                        type="text"
                        {...field}
                        id="name-english"
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
                    <FormLabel htmlFor="name-portuguese" className="sr-only">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Visita guiada à adega"
                        type="text"
                        {...field}
                        id="name-portuguese"
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

          {/* control 3 fields description */}
          <Tabs defaultValue="spanish">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Descripción Breve</Label>
              <TabsList>
                <TabsTrigger value="spanish" focusId="description-spanish">
                  Es
                </TabsTrigger>
                <TabsTrigger value="english" focusId="description-english">
                  En
                </TabsTrigger>
                <TabsTrigger
                  value="portuguese"
                  focusId="description-portuguese"
                >
                  Pt
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel
                      htmlFor="description-spanish"
                      className="sr-only"
                    >
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Pequeño mensaje introductorio"
                        className="resize-none"
                        rows={2}
                        {...field}
                        id="description-spanish"
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
                    <FormLabel
                      htmlFor="description-english"
                      className="sr-only"
                    >
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Small introductory message"
                        className="resize-none"
                        rows={2}
                        {...field}
                        id="description-english"
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
                    <FormLabel
                      htmlFor="description-portuguese"
                      className="sr-only"
                    >
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve mensagem introdutória"
                        className="resize-none"
                        rows={2}
                        {...field}
                        id="description-portuguese"
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
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url Imagen</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: https://google.com/image.jpg"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  La imagen que se mostrara como portada del tour
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Precio</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="Ej: 4500"
                        value={field.value}
                        onChange={field.onChange}
                        // {...field}
                      />
                    </FormControl>
                    <FormDescription>Por persona</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Capacidad</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="Ej: 12"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>De cada reserva</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="duration" required>
                      Duracion
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="duration"
                        type="text"
                        placeholder="Ej: 30 a 40 min"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Ej: 30 a 40 min</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* control 3 fields content */}
          <Tabs defaultValue="spanish">
            <div className="flex items-center justify-between gap-x-2">
              <Label required>Contenido</Label>
              <TabsList>
                <TabsTrigger value="spanish" focusId="content-spanish">
                  Es
                </TabsTrigger>
                <TabsTrigger value="english" focusId="content-english">
                  En
                </TabsTrigger>
                <TabsTrigger value="portuguese" focusId="content-portuguese">
                  Pt
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="spanish">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel htmlFor="content-spanish" className="sr-only">
                      Contenido
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="El Itinerario o detalles de lo que contiene el tour"
                        className="resize-none"
                        rows={8}
                        {...field}
                        id="content-spanish"
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
                name="content_en"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel htmlFor="content-english" className="sr-only">
                      Contenido
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="The Itinerary or details of what the tour contains"
                        className="resize-none"
                        rows={8}
                        {...field}
                        id="content-english"
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
                name="content_pt"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel htmlFor="content-portuguese" className="sr-only">
                      Contenido
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="O Itinerário ou detalhes do que o passeio contém"
                        className="resize-none"
                        rows={8}
                        {...field}
                        id="content-portuguese"
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
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Estado</FormLabel>
                  <FormDescription>
                    Permitir reservas desde la web
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

        <CardFormFooter>
          <div className="flex flex-1 items-center">
            {isFetching && (
              <>
                <Icons.spinner className="animate-spin" />
                <p className="ml-2 text-sm text-muted-foreground">
                  Cargando Información...
                </p>
              </>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            disabled={isPending || isFetching}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <ButtonLoading
            type="submit"
            disabled={isFetching}
            isWorking={isPending}
          >
            Guardar Cambios
          </ButtonLoading>
        </CardFormFooter>
      </form>
    </Form>
  );
}
