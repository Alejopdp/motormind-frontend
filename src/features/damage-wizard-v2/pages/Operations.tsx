import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/atoms/Button';
import { useWizardV2 } from '../hooks/useWizardV2';
import { PageShell } from '../components/PageShell';
import { WizardStepperWithNav } from '../components/WizardStepperWithNav';
import { NoConfirmedDamagesMessage } from '../components/NoConfirmedDamagesMessage';
import { OperationsInfoAlert } from '../components/OperationsInfoAlert';
import { RecommendedOperationCard } from '../components/RecommendedOperationCard';
import { DamageAction } from '../types';
import { mapDamagesWithOperations } from '../utils/operationsMapper';

const Operations = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, loadAssessmentData } = useWizardV2();

  // Obtener daños confirmados del estado del wizard
  const confirmedDamages = state.confirmedDamages || [];
  
  // Mapear operaciones desde confirmedDamages (sin gtMotiveMappings por ahora)
  const mappedOperations = useMemo(() => {
    return mapDamagesWithOperations(confirmedDamages, []);
  }, [confirmedDamages]);

  // Cargar datos del assessment siempre que estemos en el paso de Operations
  useEffect(() => {
    if (state.assessmentId) {
      loadAssessmentData().catch((error) => {
        console.error('Error cargando datos del assessment:', error);
      });
    }
  }, [state.assessmentId]);

  // Cargar datos del assessment si es necesario
  useEffect(() => {
    if (state.assessmentId) {
      loadAssessmentData().catch((error: Error) => {
        console.error('Error cargando datos del assessment:', error);
      });
    }
  }, [state.assessmentId, loadAssessmentData]);

  const handleUpdateOperation = (mappingId: string, newOperation: DamageAction, reason: string) => {
    if (!state.assessmentId) return;

    // Por ahora, solo logueamos el cambio ya que no tenemos endpoint de actualización
    console.log('🔄 Operations: Actualización de operación:', {
      mappingId,
      newOperation,
      reason,
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
            {mappedOperations.map((operation) => {
              // Encontrar el daño relacionado basándose en el nombre de la parte
              const relatedDamage = confirmedDamages.find(
                (damage) =>
                  damage.area?.toLowerCase().includes(operation.partName.toLowerCase()) ||
                  damage.subarea?.toLowerCase().includes(operation.partName.toLowerCase()) ||
                  operation.partName.toLowerCase().includes(damage.area?.toLowerCase() || '') ||
                  operation.partName.toLowerCase().includes(damage.subarea?.toLowerCase() || '')
              );

              return (
                <RecommendedOperationCard
                  key={operation.mappingId}
                  operation={operation}
                  onUpdateOperation={handleUpdateOperation}
                  relatedDamage={relatedDamage}
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
