import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { useWizardV2 } from '../context/WizardV2Context';

const Operations = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, setState } = useWizardV2();

  const ensureOps = () => {
    if (!state.operations || state.operations.length === 0) {
      setState((prev) => ({
        ...prev,
        operations: [
          {
            mappingId: 'map-1',
            partName: 'Puerta delantera izquierda',
            mainOperation: {
              operation: 'REPAIR',
              description: 'Reparación panel',
              code: 'SUPERVISOR_CORRECTED',
              complexity: 'MODERATE',
            },
            subOperations: [
              {
                operation: 'POLISH',
                description: 'Pulido difuminado',
                code: 'SUPERVISOR_CORRECTED',
              },
            ],
            paint: { apply: true, finishType: 'REPAIRED_PART', paintType: 'BICOAT' },
          },
        ],
      }));
    }
  };

  ensureOps();

  const updateMainOperation = (idx: number, operation: string) => {
    setState((prev) => {
      const copy = { ...prev };
      const ops = [...(copy.operations || [])];
      const current = { ...(ops[idx] || {}) } as any;
      current.mainOperation = { ...(current.mainOperation || {}), operation };
      ops[idx] = current;
      copy.operations = ops as any;
      return copy;
    });
  };

  const goValuation = () => {
    setState((prev) => ({ ...prev, status: 'operations_defined' }));
    setParams({ step: 'valuation' });
    navigate(`?step=valuation`, { replace: true });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Operaciones (sin horas)</h2>
      <div className="grid gap-3">
        {(state.operations || []).map((op, idx) => (
          <div key={op.mappingId} className="rounded border p-3">
            <div className="font-medium">{op.partName}</div>
            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <div className="text-sm text-gray-600">Operación principal</div>
                <Select value={op.mainOperation?.operation || 'REPAIR'} onValueChange={(value) => updateMainOperation(idx, value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REPAIR">Reparar</SelectItem>
                    <SelectItem value="REPLACE">Reemplazar</SelectItem>
                    <SelectItem value="POLISH">Pulir</SelectItem>
                    <SelectItem value="PAINT">Pintar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-amber-700 md:col-span-2">
                Pendiente de valoración (las horas se calculan en el siguiente paso)
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={goValuation}>Continuar a Valoración</Button>
      </div>
    </div>
  );
};

export default Operations;
