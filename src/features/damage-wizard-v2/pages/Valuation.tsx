import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { ValuationTable } from '../components/ValuationTable';
import { useWizardV2 } from '../context/WizardV2Context';

const Valuation = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, setState } = useWizardV2();

  if (!state.valuation) {
    // mock valuation from operations
    const labor = (state.operations || []).map((op) => ({
      mappingId: op.mappingId,
      partName: op.partName,
      operation: op.mainOperation?.operation || 'REPAIR',
      hours: 1.5,
      rate: 38,
      total: 57,
      source: 'user_override' as const,
    }));
    const paint = (state.operations || [])
      .filter((op) => op.paint?.apply)
      .map((op) => ({
        mappingId: op.mappingId,
        partName: op.partName,
        job: 'Pintura daño medio',
        paintHours: 4.2,
        paintLaborTotal: 160,
        units: 1,
        unitPrice: 35,
        materialsTotal: 40,
        total: 200,
      }));
    const parts: Array<{ ref: string; partName: string; unitPrice: number; qty: number; total: number }> = [];
    const totals = {
      labor: labor.reduce((a, b) => a + b.total, 0),
      paintLabor: paint.reduce((a, b) => a + b.paintLaborTotal, 0),
      paintMaterials: paint.reduce((a, b) => a + b.materialsTotal, 0),
      parts: parts.reduce((a, b) => a + b.total, 0),
      grandTotal: 0,
      currency: 'EUR',
    };
    totals.grandTotal = totals.labor + totals.paintLabor + totals.paintMaterials + totals.parts;
    setState((prev) => ({ ...prev, status: 'valuated', valuation: { labor, paint, parts, totals } }));
  }

  const finalize = () => {
    setParams({ step: 'finalize' });
    navigate(`?step=finalize`, { replace: true });
  };

  const v = state.valuation!;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Valoración</h2>
      <div className="grid gap-6">
        <div>
          <h3 className="font-medium mb-2">Mano de obra (sin pintura)</h3>
          <ValuationTable
            columns={[{ key: 'partName', header: 'Pieza' }, { key: 'operation', header: 'Operación' }, { key: 'hours', header: 'Horas MO' }, { key: 'rate', header: '€/h' }, { key: 'total', header: 'Total MO' }, { key: 'source', header: 'Fuente' }]}
            data={v.labor as any}
          />
        </div>
        <div>
          <h3 className="font-medium mb-2">Pintura</h3>
          <ValuationTable
            columns={[{ key: 'partName', header: 'Pieza' }, { key: 'job', header: 'Trabajo' }, { key: 'paintHours', header: 'Horas MO Pintura' }, { key: 'paintLaborTotal', header: 'Total MO Pintura (€)' }, { key: 'units', header: 'Unidades' }, { key: 'unitPrice', header: '€/unidad' }, { key: 'materialsTotal', header: 'Total Materiales (€)' }, { key: 'total', header: 'Total Pintura (€)' }]}
            data={v.paint as any}
          />
        </div>
        <div>
          <h3 className="font-medium mb-2">Recambios</h3>
          <ValuationTable
            columns={[{ key: 'ref', header: 'Ref' }, { key: 'partName', header: 'Pieza' }, { key: 'unitPrice', header: 'Precio unitario' }, { key: 'qty', header: 'Cantidad' }, { key: 'total', header: 'Total' }]}
            data={v.parts as any}
          />
        </div>
        <div className="border rounded p-4">
          <div className="font-medium mb-2">Totales</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div>MO: {v.totals.labor} {v.totals.currency}</div>
            <div>MO Pintura: {v.totals.paintLabor} {v.totals.currency}</div>
            <div>Materiales: {v.totals.paintMaterials} {v.totals.currency}</div>
            <div>Recambios: {v.totals.parts} {v.totals.currency}</div>
            <div className="font-semibold">Total: {v.totals.grandTotal} {v.totals.currency}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={finalize}>Finalizar</Button>
      </div>
    </div>
  );
};

export default Valuation;


