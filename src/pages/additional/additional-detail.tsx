import { SectionInfo } from '@/components/section-info';
import { formatPrice } from '@/lib/utils';
import { Additional } from '@/types/app.types';

export function AdditionalDetail({ detail }: { detail: Additional }) {
  return (
    <div className="relative flex flex-col gap-4">
      <SectionInfo
        title="Información en Detalle"
        items={[
          { label: 'Nombre', value: detail.name || '-', colSpan: 3 },
          {
            label: 'Descripcion',
            value: detail.description || '-',
            colSpan: 3
          },
          {
            label: 'Precio',
            value: formatPrice(detail.price) || '-',
            colSpan: 1
          },
          {
            label: 'Disponibilidad',
            value: detail.availability === '1' ? 'Si' : 'No',
            colSpan: 1
          },
          {
            label: 'Estado',
            value: detail.active === '1' ? 'Si' : 'No',
            colSpan: 1
          }
        ]}
      />
    </div>
  );
}
