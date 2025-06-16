import { DamageAction, Damage, SparePart, AdditionalAction } from '@/types/DamageAssessment';
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
import { Cog, Wrench, ChevronDown, ClipboardList, Clock, X, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

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

interface DamageCardProps {
  damage: Damage;
  onUpdateDamage?: (updatedDamage: Damage) => void;
  onDeleteDamage?: (damageId: string) => void;
  isEditable?: boolean;
}

const DamageCard = ({
  damage,
  onUpdateDamage,
  onDeleteDamage,
  isEditable = false,
}: DamageCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDamage, setEditedDamage] = useState<Damage>(damage);
  const [initialDamage] = useState<Damage>(damage);

  const { area, subarea, severity, action, notes } = editedDamage;

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

  const spareParts = editedDamage.spareParts || [];
  const additionalActions = editedDamage.additionalActions || [];

  const totalSparePartsCost = spareParts.reduce((acc, part) => acc + part.price * part.quantity, 0);

  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleSave = () => {
    if (onUpdateDamage) {
      onUpdateDamage(editedDamage);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDamage(initialDamage);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDeleteDamage && damage._id) {
      onDeleteDamage(damage._id);
    }
  };

  const updateField = <K extends keyof Damage>(field: K, value: Damage[K]) => {
    setEditedDamage((prev) => ({ ...prev, [field]: value }));
  };

  const updateSparePart = <K extends keyof SparePart>(
    index: number,
    field: K,
    value: SparePart[K],
  ) => {
    const updatedParts = [...spareParts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    updateField('spareParts', updatedParts);
  };

  const addSparePart = () => {
    const newPart: SparePart = {
      description: '',
      reference: '',
      quantity: 1,
      price: 0,
    };
    updateField('spareParts', [...spareParts, newPart]);
  };

  const removeSparePart = (index: number) => {
    const updatedParts = spareParts.filter((_, i) => i !== index);
    updateField('spareParts', updatedParts);
  };

  const updateAdditionalAction = <K extends keyof AdditionalAction>(
    index: number,
    field: K,
    value: AdditionalAction[K],
  ) => {
    const updatedActions = [...additionalActions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    updateField('additionalActions', updatedActions);
  };

  const addAdditionalAction = () => {
    const newAction: AdditionalAction = {
      description: '',
      time: 0,
    };
    updateField('additionalActions', [...additionalActions, newAction]);
  };

  const removeAdditionalAction = (index: number) => {
    const updatedActions = additionalActions.filter((_, i) => i !== index);
    updateField('additionalActions', updatedActions);
  };

  return (
    <div
      className={`mb-4 overflow-hidden rounded-lg border border-gray-200 shadow-md ${isEditing ? 'bg-blue-50' : 'bg-white'}`}
    >
      {/* Header del daño */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => !isEditing && setIsExpanded(!isExpanded)}
          >
            <p className="text-base font-semibold text-gray-900">
              {area} - {subarea}
            </p>
            <p className="mt-1 text-sm text-gray-600">{editedDamage.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`rounded px-2 py-1 text-xs font-medium ${getSeverityColor(severity)}`}>
              {severityLabelMap[severity] || 'Desconocida'}
            </span>

            {isEditable && !isEditing && (
              <button
                onClick={handleEdit}
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Editar
              </button>
            )}

            {!isEditing && (
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            )}
          </div>
        </div>

        {/* Operación de Baremo - siempre visible */}
        {action && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">{actionLabelMap[action]}</span>
              <span className="text-gray-500">| Código: PDI-REP-M</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Tiempo estándar: 1.5h</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className={`border-t border-gray-100 p-4 ${isEditing ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <div className="space-y-6">
            {/* Edición de campos básicos */}
            {isEditing && (
              <div className="space-y-4">
                <div className="text-sm font-medium text-blue-700">
                  Editando: {area} - {subarea}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Pieza Afectada
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${area} - ${subarea}`}
                      onChange={(e) => {
                        const [newArea, newSubarea] = e.target.value.split(' - ');
                        updateField('area', newArea);
                        updateField('subarea', newSubarea || '');
                      }}
                      className="flex-1 bg-white"
                      placeholder="Ej: Puerta Delantera Izquierda"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Operación de Baremo
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={action ? `${actionLabelMap[action]} | Código: PDI-REP-M` : ''}
                      readOnly
                      className="flex-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Piezas de recambio */}
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
                          <TableRow
                            key={index}
                            className="border-t border-gray-100 hover:bg-transparent"
                          >
                            <TableCell className="max-w-0">
                              {isEditing ? (
                                <Input
                                  value={part.description}
                                  onChange={(e) =>
                                    updateSparePart(index, 'description', e.target.value)
                                  }
                                  className="w-full text-sm"
                                  placeholder="Descripción de la pieza"
                                />
                              ) : (
                                <div
                                  className="truncate text-sm text-gray-900"
                                  title={part.description}
                                >
                                  {part.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="max-w-0">
                              {isEditing ? (
                                <Input
                                  value={part.reference}
                                  onChange={(e) =>
                                    updateSparePart(index, 'reference', e.target.value)
                                  }
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
                                    updateSparePart(
                                      index,
                                      'quantity',
                                      parseInt(e.target.value) || 1,
                                    )
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
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>

            {/* Suplementos / Operaciones Adicionales */}
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
                          <TableRow
                            key={index}
                            className="border-t border-gray-100 hover:bg-transparent"
                          >
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
                                <div
                                  className="truncate text-sm text-gray-900"
                                  title={act.description}
                                >
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
                                      updateAdditionalAction(
                                        index,
                                        'time',
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-20 text-center text-sm"
                                    placeholder="0"
                                    min="0"
                                  />
                                  <span className="text-xs text-gray-500">min</span>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-gray-600">
                                  {act.time} min
                                </span>
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

            {/* Notas específicas */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-900">Notas específicas</h4>
              <textarea
                value={notes || ''}
                onChange={isEditing ? (e) => updateField('notes', e.target.value) : undefined}
                className={`w-full rounded-lg border border-gray-200 p-3 text-sm ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                }`}
                rows={3}
                placeholder={isEditing ? 'Añadir notas específicas...' : 'Sin notas'}
                readOnly={!isEditing}
              />
            </div>

            {/* Botones de acción en modo edición */}
            {isEditing && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={handleCancel} className="text-gray-600">
                  Cancelar Edición
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                    Eliminar
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageCard;
