import {
  cn,
  formatDateOnly,
  formatPrice,
  formatTimeTo24Hour
} from '@/lib/utils';

import { statusVariant } from '@/components/badge-status';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import type { BookingDetail, Language } from '@/types/booking.types';
import { CardExpandable } from '@/components/card-expandable';
import { SectionInfo } from '@/components/section-info';
import { LanguageFlag } from '@/components/language-flag';

export function BookingDetail({ detail }: { detail: BookingDetail }) {
  return (
    <div className="relative flex flex-col gap-4">
      <Alert
        variant="default"
        className={cn('px-1 pb-1 pt-6', statusVariant[detail.status]?.bgColor)}
      >
        <div className="mb-4 text-center text-xl font-bold">
          {statusVariant[detail.status].text}
        </div>
        <div className="grid grid-cols-2 gap-4 rounded-md bg-accent py-4">
          <div className="text-center">
            <span className="block text-xs uppercase text-muted-foreground">
              Cantidad Reserva:
            </span>
            <span className="block text-sm font-medium">{detail.quantity}</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase text-muted-foreground">
              Total a Pagar:
            </span>
            <span className="block text-sm font-medium">
              {formatPrice(Number(detail.totalPrice))}
            </span>
          </div>
        </div>
      </Alert>

      <SectionInfo
        title="Información de la Reserva"
        items={[
          { label: 'Observaciones', value: detail.notes || '-', colSpan: 2 },
          {
            label: 'Idioma',
            value: <LanguageFlag language={detail.language as Language} />,
            colSpan: 1
          }
        ]}
      />

      <SectionInfo
        title="Información del Cliente"
        items={[
          { label: 'Nombre', value: detail.customer?.name, colSpan: 2 },
          {
            label: 'Numero Telefono',
            value: detail.customer?.phone,
            colSpan: 1
          },
          { label: 'Email', value: detail.customer?.email, colSpan: 3 }
        ]}
      />

      <SectionInfo
        title="Información del Horario Seleccionado"
        items={[
          {
            label: 'Dia',
            value: formatDateOnly(detail.schedule?.date, 'dd/MM/yyyy'),
            colSpan: 2
          },
          {
            label: 'Desde',
            value: formatTimeTo24Hour(detail.schedule?.startTime),
            colSpan: 1
          }
        ]}
        footer="Los horarios estan en formato de 24 horas."
      />

      <div>
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Adicional Agregado
        </h4>

        <Card className="mt-2 overflow-hidden">
          <ul className="flex flex-col">
            {!detail.additionals || detail.additionals.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                No hay Adicionales agregados
              </p>
            ) : (
              detail.additionals?.map((additional) => (
                <li
                  key={additional.additional_id}
                  className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0"
                >
                  <div className="grid w-full grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Nombre:</p>
                      <p className="font-semibold">
                        {additional.additional_name}
                      </p>
                    </div>
                    <div className="col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Precio Individual:
                      </p>
                      <p className="font-semibold">
                        {formatPrice(additional.additional_price)}
                      </p>
                    </div>
                    <div className="col-span-3 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Descripcion:
                      </p>
                      <p className="font-semibold">
                        {additional.additional_description}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <SectionInfo
        title="Información del Tour Reservado"
        items={[
          { label: 'Nombre', value: detail.tourData?.name || '-', colSpan: 2 },
          {
            label: 'Precio Individual',
            value: formatPrice(Number(detail.tourData?.price)) || '-',
            colSpan: 1
          },
          {
            label: 'Duración',
            value: detail.tourData?.duration || '-',
            colSpan: 2
          }
        ]}
        footer="Esta informacion fue guardada al momento de reservar. Es posible que haya cambios en el tour original."
      />

      <div>
        <h4 className="flex w-full text-xs uppercase text-muted-foreground">
          Información del Tour Reservado
          <small className="ml-auto text-xs lowercase">(Actual)</small>
        </h4>

        <CardExpandable minHeight={100}>
          <SectionInfo
            items={[
              { label: 'Nombre', value: detail.tour?.name, colSpan: 2 },
              {
                label: 'Precio Individual',
                value: formatPrice(Number(detail.tour?.price)),
                colSpan: 1
              },
              { label: 'Duración', value: detail.tour?.duration, colSpan: 2 },
              { label: 'Capacidad', value: detail.tour?.capacity, colSpan: 1 },
              {
                label: 'Descripcion Breve',
                value: detail.tour?.description,
                colSpan: 3,
                className: 'font-normal'
              },
              {
                label: 'Descripción Tour',
                value: detail.tour?.content,
                colSpan: 3,
                className: 'font-normal'
              },
              {
                label: 'Ultima Actualización',
                value:
                  detail.tour?.updatedAt &&
                  formatDateOnly(detail.tour?.updatedAt),
                colSpan: 2
              }
            ]}
          />
        </CardExpandable>
      </div>
    </div>
  );
}
