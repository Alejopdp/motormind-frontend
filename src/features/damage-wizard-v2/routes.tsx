import { useMemo } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { WizardV2Provider, useWizardV2 } from './context/WizardV2Context';
import Intake from './pages/Intake';
import Damages from './pages/Damages';
import Operations from './pages/Operations';
import Valuation from './pages/Valuation';
import Finalize from './pages/Finalize';

const WIZARD_V2_ENABLED = import.meta.env.VITE_WIZARD_V2_ENABLED === 'true';

export const WizardV2Entry = () => {
  const { id } = useParams();
  if (!WIZARD_V2_ENABLED) {
    // Redirigir al wizard v1 si el flag está apagado
    return <Navigate to={`/damage-assessments/${id}`} />;
  }
  return (
    <WizardV2Provider>
      <WizardV2Router />
    </WizardV2Provider>
  );
};

const WizardV2Router = () => {
  const [params] = useSearchParams();
  const step = params.get('step') || 'intake';
  const { state } = useWizardV2();

  const Component = useMemo(() => {
    switch (step) {
      case 'intake':
        return <Intake />;
      case 'damages':
        return <Damages />;
      case 'operations':
        return <Operations />;
      case 'valuation':
        return <Valuation />;
      case 'finalize':
        return <Finalize />;
      default:
        return <Intake />;
    }
  }, [step, state]);

  return Component;
};

export const wizardV2Routes = [
  {
    path: '/damage-assessments/:id/wizard-v2',
    element: <WizardV2Entry />,
  },
];

export default WizardV2Entry;


