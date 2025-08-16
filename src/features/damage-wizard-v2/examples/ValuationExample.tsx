import { useState } from 'react';
import { InlineEdit } from '../components/InlineEdit';
import { BatchActions } from '../components/BatchActions';
import { LaborTable } from '../components/LaborTable';
import { PaintTable } from '../components/PaintTable';
import { SparePartsTable } from '../components/SparePartsTable';
import { ValuationSummary } from '../components/ValuationSummary';
import { ValuationActions } from '../components/ValuationActions';
import { 
  BatchActionStats,
  LaborOperation, 
  PaintOperation, 
  PaintMaterial, 
  SparePart, 
  ValuationTotals 
} from '../types';

/**
 * Ejemplo completo de todos los componentes de valoración.
 * Demuestra:
 * - InlineEdit con diferentes estados (normal, ajustado)
 * - BatchActions con stats dinámicas
 * - LaborTable con operaciones editables
 * - PaintTable con MO y materiales
 * - SparePartsTable con recambios editables
 * - ValuationSummary con totales calculados
 * - ValuationActions con todas las acciones
 */
export const ValuationExample = () => {
  // InlineEdit examples
  const [price1, setPrice1] = useState(125.50);
  const [price2, setPrice2] = useState(89.90);
  const [hours, setHours] = useState(2.5);

  // BatchActions example
  const [batchStats, setBatchStats] = useState<BatchActionStats>({
    total: 5,
    confirmed: 3,
    rejected: 1,
    pending: 1
  });

  // Mock data for tables
  const [laborOps, setLaborOps] = useState<LaborOperation[]>([
    {
      id: 'labor-1',
      piece: 'Puerta trasera derecha',
      operation: 'Reparar y enderezar',
      hours: 2.5,
      rate: 42,
      total: 105.00,
      source: 'autodata',
      isManuallyAdjusted: false
    },
    {
      id: 'labor-2',
      piece: 'Guardabarros trasero',
      operation: 'Sustituir',
      hours: 1.8,
      rate: 42,
      total: 75.60,
      source: 'manual',
      isManuallyAdjusted: true
    }
  ]);

  const paintOps: PaintOperation[] = [
    { id: 'paint-1', piece: 'Puerta delantera izquierda', operation: 'Pintar', hours: 2.5, rate: 45, total: 112.50 },
    { id: 'paint-2', piece: 'Capó', operation: 'Preparar y pintar', hours: 3.0, rate: 45, total: 135.00 }
  ];

  const paintMats: PaintMaterial[] = [
    { id: 'mat-1', piece: 'Puerta delantera izquierda', description: 'Imprimación + Base + Barniz', units: '0.5L', pricePerUnit: 28.00, total: 14.00 },
    { id: 'mat-2', piece: 'Capó', description: 'Imprimación + Base + Barniz', units: '0.8L', pricePerUnit: 28.00, total: 22.40 }
  ];

  const [spareParts, setSpareParts] = useState<SparePart[]>([
    {
      id: 'part-1',
      piece: 'Retrovisor derecho',
      reference: 'RM001-233-X',
      description: 'Retrovisor exterior derecho completo',
      quantity: 1,
      unitPrice: 125.50,
      total: 125.50,
      isManuallyAdjusted: false
    },
    {
      id: 'part-2',
      piece: 'Faro delantero izquierdo',
      reference: 'FL001-445-Z', 
      description: 'Faro halógeno izquierdo',
      quantity: 1,
      unitPrice: 89.90,
      total: 89.90,
      isManuallyAdjusted: true
    }
  ]);

  // Calculate totals
  const totals: ValuationTotals = {
    laborWithoutPaint: laborOps.reduce((sum, op) => sum + op.total, 0),
    paintLabor: paintOps.reduce((sum, op) => sum + op.total, 0),
    paintMaterials: paintMats.reduce((sum, mat) => sum + mat.total, 0),
    spareParts: spareParts.reduce((sum, part) => sum + part.total, 0),
    subtotal: 0,
    tax: 0,
    total: 0
  };
  
  totals.subtotal = totals.laborWithoutPaint + totals.paintLabor + totals.paintMaterials + totals.spareParts;
  totals.tax = totals.subtotal * 0.21;
  totals.total = totals.subtotal + totals.tax;

  // Handlers
  const handleLaborUpdate = (id: string, field: keyof LaborOperation, value: number) => {
    setLaborOps(prev => prev.map(op => {
      if (op.id === id) {
        const updated = { ...op, [field]: value, isManuallyAdjusted: true };
        if (field === 'hours' || field === 'rate') {
          updated.total = updated.hours * updated.rate;
        }
        return updated;
      }
      return op;
    }));
  };

  const handleSparePartUpdate = (id: string, field: keyof SparePart, value: number) => {
    setSpareParts(prev => prev.map(part => {
      if (part.id === id) {
        const updated = { ...part, [field]: value, isManuallyAdjusted: true };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return part;
    }));
  };

  const handleConfirmAll = () => {
    setBatchStats(prev => ({ ...prev, confirmed: prev.total, pending: 0, rejected: 0 }));
  };

  const handleConfirmHighConfidence = () => {
    setBatchStats(prev => ({ ...prev, confirmed: prev.confirmed + 1, pending: Math.max(0, prev.pending - 1) }));
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-8 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Componentes de Valoración - Demo Completo
        </h1>

        {/* InlineEdit Examples */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">InlineEdit Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Precio normal:</p>
              <InlineEdit
                value={price1}
                onSave={setPrice1}
                suffix="€"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Precio ajustado manualmente:</p>
              <InlineEdit
                value={price2}
                onSave={setPrice2}
                suffix="€"
                isAdjusted={true}
                originalValue={75.00}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Horas de trabajo:</p>
              <InlineEdit
                value={hours}
                onSave={setHours}
                suffix="h"
              />
            </div>
          </div>
        </div>

        {/* BatchActions Example */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">BatchActions Component</h2>
          <BatchActions
            stats={batchStats}
            onConfirmAll={handleConfirmAll}
            onConfirmHighConfidence={handleConfirmHighConfidence}
            onAddManualDamage={() => console.log('Add manual damage')}
            onContinue={() => console.log('Continue')}
          />
        </div>

        {/* Tables Examples */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Tablas de Valoración</h2>
          
          <LaborTable 
            operations={laborOps}
            onUpdateOperation={handleLaborUpdate}
          />

          <PaintTable 
            paintOperations={paintOps}
            paintMaterials={paintMats}
          />

          <SparePartsTable 
            spareParts={spareParts}
            onUpdatePart={handleSparePartUpdate}
          />

          <ValuationSummary totals={totals} />
        </div>

        {/* Debug Information */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 mt-8">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <div className="text-sm space-y-1">
            <p>BatchStats: {JSON.stringify(batchStats)}</p>
            <p>Labor Total: {totals.laborWithoutPaint.toFixed(2)}€</p>
            <p>Paint Total: {(totals.paintLabor + totals.paintMaterials).toFixed(2)}€</p>
            <p>Parts Total: {totals.spareParts.toFixed(2)}€</p>
            <p>Final Total: {totals.total.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <ValuationActions
        onBack={() => console.log('Back to operations')}
        onSaveTemplate={() => console.log('Save template')}
        onViewSettings={() => console.log('View settings')}
        onFinalize={() => console.log('Finalize evaluation')}
      />
    </div>
  );
};
