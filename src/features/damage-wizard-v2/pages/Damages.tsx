import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useWizardV2 } from '../context/WizardV2Context';

const Damages = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, setState } = useWizardV2();

  const toggle = (id: string) => {
    const set = new Set(state.confirmedDamageIds || []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setState((prev) => ({ ...prev, confirmedDamageIds: Array.from(set) }));
  };

  const confirm = () => {
    setState((prev) => ({ ...prev, status: 'damages_confirmed' }));
    setParams({ step: 'operations' });
    navigate(`?step=operations`, { replace: true });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Daños detectados</h2>
      <div className="grid gap-3">
        {(state.detectedDamages || []).map((d) => {
          const checked = (state.confirmedDamageIds || []).includes(d.id);
          return (
            <div key={d.id} className={`border rounded p-3 flex items-center justify-between ${checked ? 'border-blue-500' : 'border-gray-200'}`}>
              <div>
                <div className="font-medium">{d.area} {d.subarea ? `- ${d.subarea}` : ''}</div>
                <div className="text-sm text-gray-600">{d.type}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="neutral">{d.severity}</Badge>
                <input type="checkbox" checked={checked} onChange={() => toggle(d.id)} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">Confirmados: {(state.confirmedDamageIds || []).length} / {(state.detectedDamages || []).length}</div>
        <Button onClick={confirm}>Confirmar daños</Button>
      </div>
    </div>
  );
};

export default Damages;


