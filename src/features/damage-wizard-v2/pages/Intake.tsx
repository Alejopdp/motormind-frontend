import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { useWizardV2 } from '../context/WizardV2Context';

const Intake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { setState } = useWizardV2();
  const [plate, setPlate] = useState('ABC123');
  const [claim, setClaim] = useState('Golpe lateral izquierdo');

  const createMockAssessment = () => {
    setState((prev) => ({
      ...prev,
      assessmentId: id,
      status: 'detected',
      plate,
      claimDescription: claim,
      images: [],
      detectedDamages: [
        { id: 'dmg-1', area: 'Puerta delantera', subarea: 'Izquierda', type: 'scratch', severity: 'SEV2' },
        { id: 'dmg-2', area: 'Aleta trasera', subarea: 'Izquierda', type: 'dent', severity: 'SEV3' },
      ],
    }));
    setParams({ step: 'damages' });
    navigate(`?step=damages`, { replace: true });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Nuevo peritaje (Wizard v2)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Matrícula</label>
          <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC123" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Descripción del siniestro</label>
          <Textarea value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="Explica brevemente" />
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={createMockAssessment}>Crear assessment (mock)</Button>
      </div>
      <div className="text-xs text-gray-500">Nota: Datos mock. Conexión backend en PRs siguientes.</div>
    </div>
  );
};

export default Intake;


