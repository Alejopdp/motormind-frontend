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
import { useDamageAssessmentDetail } from '@/context/DamageAssessment.context';
import { PaintWork, Damage } from '@/types/DamageAssessment';
import { Palette, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { onChangePrice } from '@/utils';
import { PaintMaterialType } from '@/types/PaintMaterial';

interface DamagePaintWorksTableProps {
  damageId: string;
  isEditing?: boolean;
  editFormData?: Damage;
  onUpdateField?: <K extends keyof Damage>(field: K, value: Damage[K]) => void;
  validationErrors?: Record<string, string>;
  setValidationErrors?: (
    errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
}

export const DamagePaintWorksTable = ({
  damageId,
  isEditing = false,
  editFormData,
  onUpdateField,
  validationErrors,
  setValidationErrors,
}: DamagePaintWorksTableProps) => {
  const { getDamageById } = useDamageAssessmentDetail();

  const damage = getDamageById(damageId);

  if (!damage) {
    return <div className="py-4 text-center text-sm text-gray-500">Daño no encontrado</div>;
  }

  // Usar datos de edición si están disponibles, sino los datos originales
  const paintWorks =
    isEditing && editFormData ? editFormData.paintWorks || [] : damage.paintWorks || [];
  const totalPaintWorksCost = paintWorks.reduce(
    (acc: number, paintWork: PaintWork) => acc + (paintWork.price * paintWork.quantity) / 1000,
    0,
  );

  const updatePaintWork = <K extends keyof PaintWork>(
    index: number,
    field: K,
    value: PaintWork[K],
  ) => {
    const updatedPaintWorks = [...paintWorks];
    updatedPaintWorks[index] = { ...updatedPaintWorks[index], [field]: value };

    if (onUpdateField) {
      onUpdateField('paintWorks', updatedPaintWorks);
    }

    // Limpiar errores de validación cuando el usuario edite
    if (setValidationErrors && validationErrors) {
      const errorKey = `paintWork_${index}_${field}`;
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => ({ ...prev, [errorKey]: '' }));
      }
    }
  };

  const addPaintWork = () => {
    const newPaintWork: PaintWork = {
      description: '',
      quantity: 1,
      price: 0,
      type: PaintMaterialType.BASE_PAINT,
    };

    if (onUpdateField) {
      onUpdateField('paintWorks', [...paintWorks, newPaintWork]);
    }
  };

  const removePaintWork = (index: number) => {
    const updatedPaintWorks = paintWorks.filter((_: PaintWork, i: number) => i !== index);

    if (onUpdateField) {
      onUpdateField('paintWorks', updatedPaintWorks);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Palette className="h-4 w-4" />
          Materiales de Pintura
        </h4>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={addPaintWork}
            className="h-10 text-blue-600 hover:text-blue-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Añadir Material
          </Button>
        )}
      </div>

      {paintWorks.length === 0 && isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <p className="text-center text-sm text-gray-500 italic">
            Todavía no has añadido ningún material de pintura
          </p>
        </div>
      ) : paintWorks.length === 0 && !isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-center text-sm text-gray-500 italic">
            No hay materiales de pintura definidos
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px] table-fixed hover:bg-transparent">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-transparent">
                  <TableHead className="w-[50%] text-xs font-medium text-gray-500">
                    Descripción
                  </TableHead>
                  <TableHead className="w-[15%] text-center text-xs font-medium text-gray-500">
                    Cant.
                  </TableHead>
                  <TableHead className="w-[20%] text-right text-xs font-medium text-gray-500">
                    Precio por Litro
                  </TableHead>
                  <TableHead className="w-[10%] text-right text-xs font-medium text-gray-500">
                    Total
                  </TableHead>
                  {isEditing && <TableHead className="w-[5%]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paintWorks.map((paintWork, index) => (
                  <TableRow key={index} className="border-t border-gray-100 hover:bg-transparent">
                    <TableCell className="max-w-0">
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            value={paintWork.description}
                            onChange={(e) => updatePaintWork(index, 'description', e.target.value)}
                            className={clsx(
                              'w-full text-sm',
                              validationErrors?.[`paintWork_${index}_description`] &&
                                'border-red-500 focus:border-red-500',
                            )}
                            placeholder="Descripción del material"
                          />
                          {validationErrors?.[`paintWork_${index}_description`] && (
                            <div className="absolute top-full left-0 z-20 mt-1 max-w-xs rounded bg-red-100 px-2 py-1 text-xs text-red-600 shadow-md">
                              {validationErrors[`paintWork_${index}_description`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="truncate text-sm text-gray-900"
                          title={paintWork.description}
                        >
                          {paintWork.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditing ? (
                        <div className="relative">
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              value={paintWork.quantity}
                              onKeyDown={(e) => {
                                if (paintWork.quantity === 0 && /[0-9]/.test(e.key)) {
                                  e.currentTarget.value = '';
                                }
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  updatePaintWork(index, 'quantity', 0);
                                } else {
                                  const numValue = parseInt(value, 10);
                                  if (!isNaN(numValue) && numValue >= 0) {
                                    updatePaintWork(index, 'quantity', numValue);
                                  }
                                }
                              }}
                              className={clsx(
                                'w-20 text-center text-sm',
                                validationErrors?.[`paintWork_${index}_quantity`] &&
                                  'border-red-500 focus:border-red-500',
                              )}
                              placeholder="0.00"
                            />
                            <span className="text-xs text-gray-500">ml</span>
                          </div>
                          {validationErrors?.[`paintWork_${index}_quantity`] && (
                            <div className="absolute top-full left-0 z-20 mt-1 max-w-xs rounded bg-red-100 px-2 py-1 text-xs text-red-600 shadow-md">
                              {validationErrors[`paintWork_${index}_quantity`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">{paintWork.quantity} ml</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            type="number"
                            value={paintWork.price}
                            onChange={(e) =>
                              onChangePrice(e, (value) => updatePaintWork(index, 'price', value))
                            }
                            className={clsx(
                              'w-full text-right text-sm',
                              validationErrors?.[`paintWork_${index}_price`] &&
                                'border-red-500 focus:border-red-500',
                            )}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          {validationErrors?.[`paintWork_${index}_price`] && (
                            <div className="absolute top-full left-0 z-20 mt-1 max-w-xs rounded bg-red-100 px-2 py-1 text-xs text-red-600 shadow-md">
                              {validationErrors[`paintWork_${index}_price`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="truncate text-right text-sm text-gray-900"
                          title={paintWork.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        >
                          {paintWork.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-0 text-right">
                      <div
                        className="truncate text-right text-sm font-medium text-gray-900"
                        title={((paintWork.price * paintWork.quantity) / 1000).toLocaleString(
                          'es-ES',
                          {
                            style: 'currency',
                            currency: 'EUR',
                          },
                        )}
                      >
                        {((paintWork.price * paintWork.quantity) / 1000).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                    </TableCell>
                    {isEditing && (
                      <TableCell className="p-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePaintWork(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Fila de total */}
                {paintWorks.length > 0 && (
                  <TableRow className="border-t-2 border-gray-200 bg-gray-50 hover:bg-gray-50">
                    <TableCell
                      colSpan={isEditing ? 3 : 3}
                      className="text-right text-sm font-medium text-gray-900"
                    >
                      Total materiales de pintura:
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-gray-900">
                      {totalPaintWorksCost.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </TableCell>
                    {isEditing && <TableCell></TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
