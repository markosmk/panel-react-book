import { Card, CardContent } from '@/components/ui/card';
import { AdditionalsTable } from './additionals-table';

export function ComplementsSection() {
  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-xl font-semibold">Adicionales</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Corresponde a los Extras Opcionales que pueden agregar los
              clientes al total de la reserva. Se agrega a todos los tours
              creados, puedes eliminar o marcar como no activo si deseas
              ocultarlos.
            </p>
          </div>

          <AdditionalsTable />
        </div>
      </CardContent>
    </Card>
  );
}
