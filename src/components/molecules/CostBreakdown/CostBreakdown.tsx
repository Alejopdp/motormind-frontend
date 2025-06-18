import { Calculator, FileText } from 'lucide-react';
import { DamageAssessment } from '@/types/DamageAssessment';
import { useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';

interface CostBreakdownProps {
  damageAssessment: DamageAssessment;
  onUpdateNotes: (notes: string) => void;
  onConfirmDamages?: () => void;
  isConfirming?: boolean;
  onViewReport?: () => void;
}

export const CostBreakdown = ({
  damageAssessment,
  onUpdateNotes,
  onConfirmDamages,
  isConfirming = false,
  onViewReport,
}: CostBreakdownProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(damageAssessment.notes || '');

  // Cálculos de costes
  const costBreakdown = useMemo(() => {
    const laborCost = 15; // MOCK
    const supplementsCost = 30; // MOCK

    // Calcular total de recambios de todos los daños
    const sparePartsCost = damageAssessment.damages.reduce((total, damage) => {
      if (!damage.spareParts || damage.spareParts.length === 0) return total;

      const damageSparePartsTotal = damage.spareParts.reduce((damageTotal, part) => {
        return damageTotal + part.price * part.quantity;
      }, 0);

      return total + damageSparePartsTotal;
    }, 0);

    // Verificar si hay recambios para mostrar/ocultar la línea
    const hasSpareParts = damageAssessment.damages.some(
      (damage) => damage.spareParts && damage.spareParts.length > 0,
    );

    const subtotal = laborCost + sparePartsCost + supplementsCost;
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    return {
      laborCost,
      sparePartsCost,
      supplementsCost,
      hasSpareParts,
      subtotal,
      iva,
      total,
    };
  }, [damageAssessment.damages]);

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(notesValue);
    }
    setIsEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setNotesValue(damageAssessment.notes || '');
    setIsEditingNotes(false);
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed top-24 right-20 z-20 w-80 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Resumen de Valoración y Acciones</h3>
      </div>

      {/* Desglose de Costes */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium text-gray-700">Desglose de Costes</h4>

        <div className="space-y-2 text-sm">
          {/* Mano de Obra */}
          <div className="flex justify-between">
            <span className="text-gray-600">Mano de Obra</span>
            <span className="font-medium">{formatCurrency(costBreakdown.laborCost)}</span>
          </div>

          {/* Recambios - Solo mostrar si hay recambios */}
          {costBreakdown.hasSpareParts && (
            <div className="flex justify-between">
              <span className="text-gray-600">Recambios</span>
              <span className="font-medium">{formatCurrency(costBreakdown.sparePartsCost)}</span>
            </div>
          )}

          {/* Materiales de Pintura/Suplementos */}
          <div className="flex justify-between">
            <span className="text-gray-600">Materiales de Pintura</span>
            <span className="font-medium">{formatCurrency(costBreakdown.supplementsCost)}</span>
          </div>
        </div>

        {/* Subtotal */}
        <div className="mt-4 border-t border-gray-200 pt-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Subtotal</span>
            <span>{formatCurrency(costBreakdown.subtotal)}</span>
          </div>
        </div>

        {/* IVA */}
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA (21%)</span>
            <span className="font-medium">{formatCurrency(costBreakdown.iva)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-bold">
            <span className="text-gray-900">TOTAL</span>
            <span className="text-gray-900">{formatCurrency(costBreakdown.total)}</span>
          </div>
        </div>
      </div>

      {/* Información de Tarifa */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Información de Tarifa</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Aseguradora</span>
            <span className="font-medium">{damageAssessment.insuranceCompany}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifa Hora</span>
            <span className="font-medium">€45.00/h</span>
          </div>
        </div>
      </div>

      {/* Notas Adicionales */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Notas Adicionales
          </h4>
          {!isEditingNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingNotes(true)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Editar
            </Button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-2">
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={3}
              className="w-full text-sm"
              placeholder="Añade cualquier observación o detalle adicional sobre la valoración..."
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveNotes}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelNotes}
                className="text-gray-600"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            {damageAssessment.notes ||
              'Añade cualquier observación o detalle adicional sobre la valoración...'}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        {damageAssessment.state !== 'DAMAGES_CONFIRMED' && onConfirmDamages && (
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirmDamages}
            disabled={isConfirming || damageAssessment.damages.length === 0}
          >
            {isConfirming ? 'Confirmando...' : 'Confirmar y Generar Valoración'}
          </Button>
        )}
        {damageAssessment.state === 'DAMAGES_CONFIRMED' && (
          <>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={onViewReport}
            >
              Ver Informe Completo
            </Button>
            <Button className="w-full bg-green-600 text-white hover:bg-green-700">
              Generar Informe PDF
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
