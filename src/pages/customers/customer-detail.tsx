import { SectionInfo } from '@/components/section-info';
import { formatDateOnly } from '@/lib/utils';
import type { CustomerDetail as CustomerDetailType } from '@/types/customer.types';

export function CustomerDetail({ data: detail }: { data: CustomerDetailType }) {
  if (!detail) return <></>;

  return (
    <div className="relative flex flex-col gap-4">
      <SectionInfo
        title="Información del Cliente"
        className="grid-cols-4"
        items={[
          { label: 'Nombre', value: detail.name || '-', colSpan: 2 },
          {
            label: 'Número Teléfono',
            value: detail.phone || '-',
            colSpan: 1
          },
          {
            label: 'Email',
            value: detail.email || '-',
            colSpan: 2
          },
          {
            label: 'Lugar de Residencia',
            value: detail.origen || '-',
            colSpan: 2
          },
          {
            label: 'Como se entero de nosotros',
            value:
              detail.findAbout === 'other'
                ? detail.customAbout
                : detail.about || '-',
            colSpan: 2
          },
          {
            label: 'Indico que desea Newsletter?',
            value: detail.wantNewsletter === '1' ? 'Si' : 'No',
            colSpan: 2
          },
          {
            label: 'Hospedaje / Alojamiento',
            value: detail.hotel || '-',
            colSpan: 2
          },
          {
            label: 'Cantidad de Reservas',
            value: detail.total_bookings || '-',
            colSpan: 2
          },
          {
            label: 'Creado desde',
            value: detail.type === 'WEB' ? 'Web' : 'Panel',
            colSpan: 2
          },
          {
            label: 'Ultima actualización',
            value:
              detail.created_at !== detail.updated_at
                ? formatDateOnly(detail.updated_at, 'dd/MM/yyyy HH:mm')
                : '-',
            colSpan: 2
          }
        ]}
      />
    </div>
  );
}
