import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useWizardV2 } from '../context/WizardV2Context';
import { PageShell } from '../components/PageShell';
import { SectionPaper } from '../components/SectionPaper';
import { WizardStepperWithNav } from '../components/WizardStepperWithNav';


const Finalize = () => {
  const navigate = useNavigate();
  const { state } = useWizardV2();



  const goToList = () => {
    navigate('/damage-assessments');
  };

  return (
    <PageShell
      header={<WizardStepperWithNav currentStep="finalize" completedSteps={['intake', 'damages', 'operations', 'valuation']} />}
      content={
        <div className="flex justify-center">
          <SectionPaper className="max-w-md text-center">
            {/* Success icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900">¡Peritaje completado!</h2>

            {/* Summary */}
            <div className="mb-6 space-y-2 text-sm text-gray-600">
              <p>
                Matrícula: <span className="font-medium">{state.plate}</span>
              </p>
              <p>
                Daños confirmados:{' '}
                <span className="font-medium">{state.confirmedDamageIds?.length || 0}</span>
              </p>
              <p>
                Estado: <span className="font-medium text-green-600">Completado</span>
              </p>
            </div>

            {/* Description */}
            <p className="mb-8 text-gray-600">
              El peritaje ha sido procesado correctamente. Puedes acceder al reporte completo desde
              el listado de peritajes.
            </p>

            {/* CTA */}
            <Button onClick={goToList} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
          </SectionPaper>
        </div>
      }
    />
  );
};

export default Finalize;
