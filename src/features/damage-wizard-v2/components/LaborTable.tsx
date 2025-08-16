import { SectionPaper } from './SectionPaper';
import { InlineEdit } from './InlineEdit';
import { Badge } from '@/components/atoms/Badge';
import { LaborOperation } from '../types';

interface LaborTableProps {
  operations: LaborOperation[];
  onUpdateOperation: (id: string, field: keyof LaborOperation, value: number) => void;
  className?: string;
}

/**
 * Tabla de Mano de Obra (sin pintura).
 * Diseñado para paridad 1:1 con el prototipo de Lovable.
 *
 * - Header: "Mano de obra (sin pintura)" con border-b
 * - Columns: Pieza/Componente | Operación | Horas MO | Tarifa (€/h) | Total MO (€) | Fuente
 * - InlineEdit: horas y tarifa editables con isAdjusted styling
 * - Source badges: "autodata" o "manual" con variant outline
 * - Totals footer: bg-muted/30 + font-bold + text-lg
 * - Hover: bg-muted/30 en filas
 */
export const LaborTable = ({ operations, onUpdateOperation, className }: LaborTableProps) => {
  const total = operations.reduce((sum, op) => sum + op.total, 0);

  return (
    <SectionPaper className={className}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Mano de obra (sin pintura)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Pieza/Componente</th>
              <th className="text-left p-3 font-medium">Operación</th>
              <th className="text-right p-3 font-medium">Horas MO</th>
              <th className="text-right p-3 font-medium">Tarifa (€/h)</th>
              <th className="text-right p-3 font-medium">Total MO (€)</th>
              <th className="text-center p-3 font-medium">Fuente</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((operation) => (
              <tr key={operation.id} className="border-b border-border hover:bg-muted/30">
                <td className="p-3">{operation.piece}</td>
                <td className="p-3">{operation.operation}</td>
                <td className="p-3 text-right">
                  <InlineEdit
                    value={operation.hours}
                    onSave={(value) => onUpdateOperation(operation.id, 'hours', value)}
                    isAdjusted={operation.isManuallyAdjusted}
                  />
                </td>
                <td className="p-3 text-right">
                  <InlineEdit
                    value={operation.rate}
                    onSave={(value) => onUpdateOperation(operation.id, 'rate', value)}
                    suffix="€"
                    isAdjusted={operation.isManuallyAdjusted}
                  />
                </td>
                <td className="p-3 text-right font-semibold">
                  {operation.total.toFixed(2)}€
                </td>
                <td className="p-3 text-center">
                  <Badge variant="outline" className="text-xs">
                    {operation.source}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/30">
            <tr>
              <td colSpan={4} className="p-3 text-right font-semibold">Total Mano de Obra:</td>
              <td className="p-3 text-right font-bold text-lg">{total.toFixed(2)}€</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </SectionPaper>
  );
};
