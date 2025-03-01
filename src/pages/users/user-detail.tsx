import { SectionInfo } from '@/components/section-info';
import { formatDateOnly } from '@/lib/utils';
import type { UserTable } from '@/types/user.types';

export function UserDetail({ data: detail }: { data: UserTable }) {
  if (!detail) return <></>;

  return (
    <div className="relative flex flex-col gap-4">
      <SectionInfo
        title="Información del Usuario"
        className="grid-cols-4"
        items={[
          { label: 'Nombre', value: detail.name || '-', colSpan: 2 },
          {
            label: 'Nombre de Usuario',
            value: detail.username || '-',
            colSpan: 2
          },
          {
            label: 'Email',
            value: detail.email || '-',
            colSpan: 2
          },
          {
            label: 'Rol',
            value: detail.role || '-',
            colSpan: 2
          }
        ]}
      />

      <p className="text-sm text-muted-foreground">
        ultima actualizacion: {formatDateOnly(detail.updated_at)}
      </p>
    </div>
  );
}
