import { DamageAction, Damage, SparePart } from '@/types/DamageAssessment';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import { DamageSeverity } from '@/types/DamageAssessment';
import { Cog, Wrench, ChevronDown, ClipboardList, FileText, Clock } from 'lucide-react';

const MOCK_SPARE_PARTS: SparePart[] = [
  {
    description: 'Grapa de sujeción',
    reference: 'REF-12345-XYZ',
    quantity: 5,
    price: 0.5,
  },
  {
    description: 'Adhesivo estructural',
    reference: 'REF-67890-ABC',
    quantity: 1,
    price: 12.75,
  },
];

const MOCK_ADDITIONAL_ACTIONS: { description: string; time: string }[] = [
  { description: 'Ajuste de puerta', time: '0.3h' },
];

const severityLabelMap: Record<DamageSeverity, string> = {
  [DamageSeverity.SEV1]: 'Muy Leve (Pulido)',
  [DamageSeverity.SEV2]: 'Leve (Reparación rápida)',
  [DamageSeverity.SEV3]: 'Medio (Rayón)',
  [DamageSeverity.SEV4]: 'Grave (Chapa y pintura)',
  [DamageSeverity.SEV5]: 'Muy Grave (Reemplazo)',
};

const actionLabelMap: Record<DamageAction, string> = {
  [DamageAction.POLISH]: 'Pulido',
  [DamageAction.RENOVATE]: 'Renovación',
  [DamageAction.QUICK_REPAIR]: 'Reparación rápida',
  [DamageAction.PAINT]: 'Pintura',
  [DamageAction.REPAIR_AND_PAINT]: 'Reparación y pintura',
  [DamageAction.REPLACE]: 'Reemplazo',
};

// const actionIconMap: Record<DamageAction, React.ReactNode> = {
//   [DamageAction.POLISH]: <Check className="h-4 w-4 text-green-500" />,
//   [DamageAction.RENOVATE]: <Cog className="h-4 w-4 text-blue-500" />,
//   [DamageAction.QUICK_REPAIR]: <Wrench className="h-4 w-4 text-yellow-500" />,
//   [DamageAction.PAINT]: <Paintbrush className="h-4 w-4 text-purple-500" />,
//   [DamageAction.REPAIR_AND_PAINT]: <Hammer className="h-4 w-4 text-orange-500" />,
//   [DamageAction.REPLACE]: <Trash2 className="h-4 w-4 text-red-500" />,
// };

const DamageCard = ({ damage }: { damage: Damage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { area, subarea, severity, action, notes } = damage;

  const getSeverityColor = (s: DamageSeverity) => {
    switch (s) {
      case DamageSeverity.SEV1:
        return 'bg-blue-100 text-blue-800';
      case DamageSeverity.SEV2:
        return 'bg-green-100 text-green-800';
      case DamageSeverity.SEV3:
        return 'bg-yellow-100 text-yellow-800';
      case DamageSeverity.SEV4:
        return 'bg-orange-200 text-orange-800';
      case DamageSeverity.SEV5:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const spareParts = MOCK_SPARE_PARTS;
  const additionalActions = MOCK_ADDITIONAL_ACTIONS;

  const totalSparePartsCost =
    spareParts?.reduce((acc, part) => acc + part.price * part.quantity, 0) || 0;

  return (
    <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-4 hover:bg-gray-50">
        <div
          className="flex cursor-pointer items-start justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <p className="font-semibold text-gray-800">
              {area} - {subarea}
            </p>
            <p className="text-sm text-gray-500">{damage.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getSeverityColor(
                severity,
              )}`}
            >
              {severityLabelMap[severity] || 'Desconocida'}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {action && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex-col items-center text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Wrench className="h-4 w-4" />
                <span className="font-medium">{actionLabelMap[action]}</span>
                <span className="text-gray-500">| Código: PDI-REP-M</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Tiempo estándar: 1.5h</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="bg-gray-50/50 p-4">
          <div className="space-y-6">
            {spareParts && spareParts.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                  <Cog className="h-4 w-4" />
                  Piezas de recambio sugeridas
                </h4>
                <div className="overflow-x-auto rounded-md bg-white">
                  <Table className="pointer-events-none">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-2/5 !text-sm text-gray-500">Descripción</TableHead>
                        <TableHead className="w-1/5 !text-sm text-gray-500">Referencia</TableHead>
                        <TableHead className="w-1/5 text-center !text-sm text-gray-500">
                          Cant.
                        </TableHead>
                        <TableHead className="w-1/5 text-right !text-sm text-gray-500">
                          Precio Ud.
                        </TableHead>
                        <TableHead className="w-1/5 text-right !text-sm text-gray-500">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {spareParts.map((part, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-gray-600">{part.description}</TableCell>
                          <TableCell className="font-mono text-xs text-gray-600">
                            {part.reference}
                          </TableCell>
                          <TableCell className="text-center text-gray-600">
                            {part.quantity}
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {part.price.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {(part.price * part.quantity).toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t">
                        <TableCell
                          colSpan={4}
                          className="text-right !text-sm font-medium text-gray-800"
                        >
                          Total recambios:
                        </TableCell>
                        <TableCell className="text-right !text-sm font-bold text-gray-800">
                          {totalSparePartsCost.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {additionalActions && additionalActions.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                  <ClipboardList className="h-4 w-4" />
                  Suplementos / Operaciones Adicionales
                </h4>
                <div className="rounded-md bg-white p-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2 font-medium text-gray-500">
                    <span>Descripción</span>
                    <span className="text-right">Tiempo</span>
                  </div>
                  <ul className="mt-2 space-y-2">
                    {additionalActions.map((act, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-700">{act.description}</span>
                        <span className="font-medium text-gray-600">{act.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {notes && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                  <FileText className="h-4 w-4" />
                  Notas
                </h4>
                <textarea
                  name=""
                  id=""
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={notes}
                  readOnly
                ></textarea>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageCard;
