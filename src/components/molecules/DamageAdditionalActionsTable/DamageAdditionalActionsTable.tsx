import { ClipboardList, Plus, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import { AdditionalAction } from '@/types/DamageAssessment';
import { useDamageAssessmentDetail } from '@/context/DamageAssessment.context';

interface DamageAdditionalActionsTableProps {
  damageId: string;
  isEditing?: boolean;
}

export const DamageAdditionalActionsTable = ({
  damageId,
  isEditing = false,
}: DamageAdditionalActionsTableProps) => {
  const { getDamageById, updateDamage } = useDamageAssessmentDetail();

  const damage = getDamageById(damageId);

  if (!damage) {
    return <div className="py-4 text-center text-sm text-gray-500">Daño no encontrado</div>;
  }

  const additionalActions = damage.additionalActions || [];

  const updateAdditionalAction = <K extends keyof AdditionalAction>(
    index: number,
    field: K,
    value: AdditionalAction[K],
  ) => {
    const updatedActions = [...additionalActions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    updateDamage(damageId, { additionalActions: updatedActions });
  };

  const addAdditionalAction = () => {
    const newAction: AdditionalAction = {
      description: '',
      time: 0,
    };
    updateDamage(damageId, { additionalActions: [...additionalActions, newAction] });
  };

  const removeAdditionalAction = (index: number) => {
    const updatedActions = additionalActions.filter((_, i) => i !== index);
    updateDamage(damageId, { additionalActions: updatedActions });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <ClipboardList className="h-4 w-4" />
          Suplementos / Operaciones Adicionales
        </h4>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={addAdditionalAction}
            className="h-10 text-blue-600 hover:text-blue-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Añadir Suplemento
          </Button>
        )}
      </div>

      {additionalActions.length === 0 && isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <p className="text-center text-sm text-gray-500 italic">
            Todavía no has añadido ningún suplemento u operación adicional
          </p>
        </div>
      ) : additionalActions.length === 0 && !isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-center text-sm text-gray-500 italic">
            No hay suplementos u operaciones adicionales definidas
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[400px] table-fixed hover:bg-transparent">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-transparent">
                  <TableHead className="w-[70%] text-xs font-medium text-gray-500">
                    Descripción
                  </TableHead>
                  <TableHead className="w-[20%] text-right text-xs font-medium text-gray-500">
                    Tiempo
                  </TableHead>
                  {isEditing && <TableHead className="w-[10%]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {additionalActions.map((act, index) => (
                  <TableRow key={index} className="border-t border-gray-100 hover:bg-transparent">
                    <TableCell className="max-w-0">
                      {isEditing ? (
                        <Input
                          value={act.description}
                          onChange={(e) =>
                            updateAdditionalAction(index, 'description', e.target.value)
                          }
                          className="w-full text-sm"
                          placeholder="Descripción del suplemento"
                        />
                      ) : (
                        <div className="truncate text-sm text-gray-900" title={act.description}>
                          {act.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            value={act.time}
                            onChange={(e) =>
                              updateAdditionalAction(index, 'time', parseInt(e.target.value) || 0)
                            }
                            className="w-20 text-center text-sm"
                            placeholder="0"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">min</span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{act.time} min</span>
                      )}
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalAction(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
