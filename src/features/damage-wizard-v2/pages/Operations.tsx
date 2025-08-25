import { Button } from '@/components/atoms/Button';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NoConfirmedDamagesMessage } from '../components/NoConfirmedDamagesMessage';
import { OperationsInfoAlert } from '../components/OperationsInfoAlert';
import { PageShell } from '../components/PageShell';
import { RecommendedOperationCard } from '../components/RecommendedOperationCard';
import { WizardStepperWithNav } from '../components/WizardStepperWithNav';
import { useWizardV2 } from '../hooks/useWizardV2';
import { DamageAction } from '../types';

const Operations = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, loadAssessmentData } = useWizardV2();

  // Obtener daños confirmados del estado del wizard
  const confirmedDamages = state.confirmedDamages || [];

  // Cargar datos del assessment solo una vez al montar el componente
  useEffect(() => {
    if (state.assessmentId && !state.confirmedDamages?.length) {
      loadAssessmentData().catch((error: Error) => {
        console.error('Error cargando datos del assessment:', error);
      });
    }
  }, [state.assessmentId]); // Removemos loadAssessmentData de las dependencias

  const handleUpdateOperation = (providerDamageId: string, newOperation: DamageAction) => {
    if (!state.assessmentId) return;

    // Por ahora, solo logueamos el cambio ya que no tenemos endpoint de actualización
    console.log('🔄 Operations: Actualización de operación:', {
      providerDamageId,
      newOperation,
    });
  };

  const goValuation = async () => {
    try {
      setParams({ step: 'valuation' });
      navigate(`?step=valuation`, { replace: true });
    } catch (error) {
      console.error('Error navegando a valuation:', error);
      // Fallback a navegación directa en caso de error
      console.warn('Fallback: navegando a valuation después de error');
      setParams({ step: 'valuation' });
      navigate(`?step=valuation`, { replace: true });
    }
  };

  const handleGoBack = () => {
    setParams({ step: 'damages' });
    navigate(`?step=damages`, { replace: true });
  };

  // Mostrar mensaje si no hay daños confirmados
  if (confirmedDamages.length === 0) {
    return (
      <PageShell
        header={
          <WizardStepperWithNav currentStep="operations" completedSteps={['intake', 'damages']} />
        }
        title="Operaciones de reparación"
        subtitle="Define las operaciones necesarias para cada daño confirmado"
        content={<NoConfirmedDamagesMessage onGoBack={handleGoBack} />}
      />
    );
  }

  return (
    <PageShell
      header={
        <WizardStepperWithNav currentStep="operations" completedSteps={['intake', 'damages']} />
      }
      title="Operaciones de reparación"
      subtitle="Define las operaciones necesarias para cada daño confirmado"
      content={
        <>
          <OperationsInfoAlert />

          {/* Operations list */}
          <div className="space-y-4">
            {confirmedDamages.map((confirmedDamage) => {
              // Encontrar el daño relacionado basándose en el nombre de la parte

              return (
                <RecommendedOperationCard
                  key={confirmedDamage.area}
                  damage={confirmedDamage}
                  proposedOperation={confirmedDamage.action as DamageAction}
                  onUpdateOperation={handleUpdateOperation}
                />
              );
            })}
          </div>
        </>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={goValuation} className="px-6">
            Continuar a Valoración
          </Button>
        </div>
      }
    />
  );
};

export default Operations;
