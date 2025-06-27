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
import { AdditionalAction, Damage } from '@/types/DamageAssessment';
import { useDamageAssessmentDetail } from '@/context/DamageAssessment.context';
import clsx from 'clsx';
import { onChangePrice } from '@/utils';

interface DamageAdditionalActionsTableProps {
  damageId: string;
  isEditing?: boolean;
  editFormData?: Damage;
  onUpdateField?: <K extends keyof Damage>(field: K, value: Damage[K]) => void;
  validationErrors?: Record<string, string>;
  setValidationErrors?: (
    errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
}

export const DamageAdditionalActionsTable = ({
  damageId,
  isEditing = false,
  editFormData,
  onUpdateField,
  validationErrors,
  setValidationErrors,
}: DamageAdditionalActionsTableProps) => {
  const { getDamageById } = useDamageAssessmentDetail();

  const damage = getDamageById(damageId);

  if (!damage) {
    return <div className="py-4 text-center text-sm text-gray-500">Daño no encontrado</div>;
  }

  // Usar datos de edición si están disponibles, sino los datos originales
  const additionalActions =
    isEditing && editFormData
      ? editFormData.additionalActions || []
      : damage.additionalActions || [];

  const updateAdditionalAction = <K extends keyof AdditionalAction>(
    index: number,
    field: K,
    value: AdditionalAction[K],
  ) => {
    const updatedActions = [...additionalActions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };

    if (onUpdateField) {
      onUpdateField('additionalActions', updatedActions);
    }

    // Limpiar errores de validación cuando el usuario edite
    if (setValidationErrors && validationErrors) {
      const errorKey = `additionalAction_${index}_${field}`;
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => ({ ...prev, [errorKey]: '' }));
      }
    }
  };

  const addAdditionalAction = () => {
    const newAction: AdditionalAction = {
      description: '',
      time: 0,
      hourlyRate: 0, // Will be set from damage assessment context or user input
    };

    if (onUpdateField) {
      onUpdateField('additionalActions', [...additionalActions, newAction]);
    }
  };

  const removeAdditionalAction = (index: number) => {
    const updatedActions = additionalActions.filter((_, i) => i !== index);

    if (onUpdateField) {
      onUpdateField('additionalActions', updatedActions);
    }
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
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[500px] table-fixed hover:bg-transparent">
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
                    <TableCell className="max-w-0 align-top">
                      <div className="space-y-1">
                        {isEditing ? (
                          <>
                            <Input
                              value={act.description}
                              onChange={(e) =>
                                updateAdditionalAction(index, 'description', e.target.value)
                              }
                              className={clsx(
                                'w-full text-sm',
                                validationErrors?.[`additionalAction_${index}_description`] &&
                                  'border-red-500 focus:border-red-500',
                              )}
                              placeholder="Descripción del suplemento"
                            />
                            {validationErrors?.[`additionalAction_${index}_description`] && (
                              <div className="w-fit rounded bg-red-100 px-2 py-1 text-xs text-red-600">
                                {validationErrors[`additionalAction_${index}_description`]}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="truncate text-sm text-gray-900" title={act.description}>
                            {act.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="space-y-1">
                        {isEditing ? (
                          <>
                            <div className="flex items-center justify-end gap-2">
                              <Input
                                type="number"
                                value={act.time}
                                onChange={(e) =>
                                  updateAdditionalAction(
                                    index,
                                    'time',
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className={clsx(
                                  'w-20 text-center text-sm',
                                  validationErrors?.[`additionalAction_${index}_time`] &&
                                    'border-red-500 focus:border-red-500',
                                )}
                                placeholder="0"
                                min="0"
                              />
                              <span className="text-xs text-gray-500">min</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <div className="space-y-1">
                          {isEditing ? (
                            <>
                              <div className="flex items-center justify-end gap-2">
                                <Input
                                  type="number"
                                  value={act.time}
                                  onKeyDown={(e) => {
                                    if (act.time === 0 && /[0-9]/.test(e.key)) {
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                  onChange={(e) =>
                                    updateAdditionalAction(
                                      index,
                                      'time',
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className={clsx(
                                    'w-20 text-center text-sm',
                                    validationErrors?.[`additionalAction_${index}_time`] &&
                                      'border-red-500 focus:border-red-500',
                                  )}
                                  placeholder="0"
                                  min="0"
                                />
                                <span className="text-xs text-gray-500">min</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm font-medium text-gray-600">{act.time} min</span>
                        )}
                      </div>
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
                      <TableCell className="text-right align-top">
                        <div className="space-y-1">
                          {isEditing ? (
                            <>
                              <div className="flex items-center justify-end gap-2">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={act.hourlyRate || 0}
                                  onChange={(e) =>
                                    onChangePrice(e, (value) =>
                                      updateAdditionalAction(index, 'hourlyRate', value),
                                    )
                                  }
                                  className={clsx(
                                    'w-20 text-center text-sm',
                                    validationErrors?.[`additionalAction_${index}_hourlyRate`] &&
                                      'border-red-500 focus:border-red-500',
                                  )}
                                  placeholder="0.00"
                                  min="0"
                                />
                                <span className="text-xs text-gray-500">€/h</span>
                              </div>
                              {validationErrors?.[`additionalAction_${index}_hourlyRate`] && (
                                <div className="ml-auto w-fit rounded bg-red-100 px-2 py-1 text-xs text-red-600">
                                  {validationErrors[`additionalAction_${index}_hourlyRate`]}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {(act.hourlyRate || 0).toFixed(2)}€/h
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-middle">
                        <span className="text-sm font-semibold text-gray-900">
                          {totalCost.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                      </TableCell>
                      {isEditing && (
                        <TableCell className="p-0">
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
