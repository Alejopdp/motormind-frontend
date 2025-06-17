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
import { SparePart } from '@/types/DamageAssessment';
import { Cog, Plus, X } from 'lucide-react';

interface DamageSparePartsTableProps {
  damageId: string;
  isEditing?: boolean;
}

export const DamageSparePartsTable = ({
  damageId,
  isEditing = false,
}: DamageSparePartsTableProps) => {
  const { getDamageById, updateDamage } = useDamageAssessmentDetail();

  const damage = getDamageById(damageId);

  if (!damage) {
    return <div className="py-4 text-center text-sm text-gray-500">Daño no encontrado</div>;
  }

  const spareParts = damage.spareParts || [];
  const totalSparePartsCost = spareParts.reduce((acc, part) => acc + part.price * part.quantity, 0);

  const updateSparePart = <K extends keyof SparePart>(
    index: number,
    field: K,
    value: SparePart[K],
  ) => {
    const updatedParts = [...spareParts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    updateDamage(damageId, { spareParts: updatedParts });
  };

  const addSparePart = () => {
    const newPart: SparePart = {
      description: '',
      reference: '',
      quantity: 1,
      price: 0,
    };
    updateDamage(damageId, { spareParts: [...spareParts, newPart] });
  };

  const removeSparePart = (index: number) => {
    const updatedParts = spareParts.filter((_, i) => i !== index);
    updateDamage(damageId, { spareParts: updatedParts });
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
                        <Input
                          value={part.description}
                          onChange={(e) => updateSparePart(index, 'description', e.target.value)}
                          className="w-full text-sm"
                          placeholder="Descripción de la pieza"
                        />
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
                        <Input
                          type="number"
                          value={part.quantity}
                          onChange={(e) =>
                            updateSparePart(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="w-full text-center text-sm"
                          min="1"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{part.quantity}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={part.price}
                          onChange={(e) =>
                            updateSparePart(index, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-right text-sm"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
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
                    <TableCell className="max-w-0 text-right">
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
