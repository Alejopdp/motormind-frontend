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
import { SparePart, Damage } from '@/types/DamageAssessment';
import { Cog, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { onChangePrice } from '@/utils';

interface DamageSparePartsTableProps {
  damageId: string;
  isEditing?: boolean;
  editFormData?: Damage;
  onUpdateField?: <K extends keyof Damage>(field: K, value: Damage[K]) => void;
  validationErrors?: Record<string, string>;
  setValidationErrors?: (
    errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
}

export const DamageSparePartsTable = ({
  damageId,
  isEditing = false,
  editFormData,
  onUpdateField,
  validationErrors,
  setValidationErrors,
}: DamageSparePartsTableProps) => {
  const { getDamageById } = useDamageAssessmentDetail();

  const damage = getDamageById(damageId);

  if (!damage) {
    return <div className="py-4 text-center text-sm text-gray-500">Daño no encontrado</div>;
  }

  // Usar datos de edición si están disponibles, sino los datos originales
  const spareParts =
    isEditing && editFormData ? editFormData.spareParts || [] : damage.spareParts || [];
  const totalSparePartsCost = spareParts.reduce(
    (acc: number, part: SparePart) => acc + part.price * part.quantity,
    0,
  );

  const updateSparePart = <K extends keyof SparePart>(
    index: number,
    field: K,
    value: SparePart[K],
  ) => {
    const updatedParts = [...spareParts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };

    if (onUpdateField) {
      onUpdateField('spareParts', updatedParts);
    }

    // Limpiar errores de validación cuando el usuario edite
    if (setValidationErrors && validationErrors) {
      const errorKey = `sparePart_${index}_${field}`;
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => ({ ...prev, [errorKey]: '' }));
      }
    }
  };

  const addSparePart = () => {
    const newPart: SparePart = {
      description: '',
      reference: '',
      quantity: 1,
      price: 0,
    };

    if (onUpdateField) {
      onUpdateField('spareParts', [...spareParts, newPart]);
    }
  };

  const removeSparePart = (index: number) => {
    const updatedParts = spareParts.filter((_: SparePart, i: number) => i !== index);

    if (onUpdateField) {
      onUpdateField('spareParts', updatedParts);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Cog className="h-4 w-4" />
          Piezas de recambio sugeridas
        </h4>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={addSparePart}
            className="h-10 text-blue-600 hover:text-blue-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Añadir Recambio
          </Button>
        )}
      </div>

      {spareParts.length === 0 && isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <p className="text-center text-sm text-gray-500 italic">
            Todavía no has añadido ninguna pieza de recambio
          </p>
        </div>
      ) : spareParts.length === 0 && !isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-center text-sm text-gray-500 italic">
            No hay piezas de recambio definidas
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px] table-fixed hover:bg-transparent">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-transparent">
                  <TableHead className="w-[180px] text-xs font-medium text-gray-500">
                    Descripción
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-medium text-gray-500">
                    Referencia
                  </TableHead>
                  <TableHead className="w-[60px] text-center text-xs font-medium text-gray-500">
                    Cant.
                  </TableHead>
                  <TableHead className="w-[100px] text-right text-xs font-medium text-gray-500">
                    Precio Ud.
                  </TableHead>
                  <TableHead className="w-[100px] text-right text-xs font-medium text-gray-500">
                    Total
                  </TableHead>
                  {isEditing && <TableHead className="w-[40px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {spareParts.map((part, index) => (
                  <TableRow key={index} className="border-t border-gray-100 hover:bg-transparent">
                    <TableCell className="max-w-0">
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            value={part.description}
                            onChange={(e) => updateSparePart(index, 'description', e.target.value)}
                            className={clsx(
                              'w-full text-sm',
                              validationErrors?.[`sparePart_${index}_description`] &&
                                'border-red-500 focus:border-red-500',
                            )}
                            placeholder="Descripción de la pieza"
                          />
                          {validationErrors?.[`sparePart_${index}_description`] && (
                            <div className="absolute top-full left-0 z-20 mt-1 max-w-xs rounded bg-red-100 px-2 py-1 text-xs text-red-600 shadow-md">
                              {validationErrors[`sparePart_${index}_description`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="truncate text-sm text-gray-900" title={part.description}>
                          {part.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-0">
                      {isEditing ? (
                        <Input
                          value={part.reference}
                          onChange={(e) => updateSparePart(index, 'reference', e.target.value)}
                          className="w-full font-mono text-xs"
                          placeholder="REF-001"
                        />
                      ) : (
                        <div
                          className="truncate font-mono text-xs text-gray-500"
                          title={part.reference}
                        >
                          {part.reference}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            type="number"
                            value={part.quantity}
                            onKeyDown={(e) => {
                              if (part.quantity === 0 && /[0-9]/.test(e.key)) {
                                e.currentTarget.value = '';
                              }
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                updateSparePart(index, 'quantity', 0);
                              } else {
                                const numValue = parseInt(value, 10);
                                if (!isNaN(numValue) && numValue >= 0) {
                                  updateSparePart(index, 'quantity', numValue);
                                }
                              }
                            }}
                            className={clsx(
                              'w-full text-center text-sm',
                              validationErrors?.[`sparePart_${index}_quantity`] &&
                                'border-red-500 focus:border-red-500',
                            )}
                          />
                          {validationErrors?.[`sparePart_${index}_quantity`] && (
                            <div className="absolute top-full left-0 z-20 mt-1 max-w-xs rounded bg-red-100 px-2 py-1 text-xs text-red-600 shadow-md">
                              {validationErrors[`sparePart_${index}_quantity`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">{part.quantity}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            type="number"
                            value={part.price}
                            onChange={(e) =>
                              onChangePrice(e, (value) => updateSparePart(index, 'price', value))
                            }
                            className={clsx(
                              'w-full text-right text-sm',
                              validationErrors?.[`sparePart_${index}_price`] &&
                                'border-red-500 focus:border-red-500',
                            )}
                            step="0.01"
                            placeholder="0,00"
                          />
                          {validationErrors?.[`sparePart_${index}_price`] && (
                            <div className="absolute top-full left-0 z-20 mt-1 max-w-xs rounded bg-red-100 px-2 py-1 text-xs text-red-600 shadow-md">
                              {validationErrors[`sparePart_${index}_price`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="truncate text-right text-sm text-gray-900"
                          title={part.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        >
                          {part.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-0 text-right align-middle">
                      <div
                        className="truncate text-right text-sm font-medium text-gray-900"
                        title={(part.price * part.quantity).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      >
                        {(part.price * part.quantity).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSparePart(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Fila de total */}
                {spareParts.length > 0 && (
                  <TableRow className="border-t-2 border-gray-200 bg-gray-50 hover:bg-gray-50">
                    <TableCell
                      colSpan={isEditing ? 4 : 4}
                      className="text-right text-sm font-medium text-gray-900"
                    >
                      Total recambios:
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-gray-900">
                      {totalSparePartsCost.toLocaleString('es-ES', {
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
