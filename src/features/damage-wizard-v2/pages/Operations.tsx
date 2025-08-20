import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { useWizardV2 } from '../hooks/useWizardV2';
import { useOperations } from '../hooks/useOperations';
import { PageShell } from '../components/PageShell';
import { WizardStepperWithNav } from '../components/WizardStepperWithNav';
import { NoConfirmedDamagesMessage } from '../components/NoConfirmedDamagesMessage';
import { OperationsInfoAlert } from '../components/OperationsInfoAlert';
import { ProgressCard } from '../components/ProgressCard';
import { RecommendedOperationCard } from '../components/RecommendedOperationCard';
import { DamageAction } from '../types';

const Operations = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, loadAssessmentData } = useWizardV2();
  const { 
    operations, 
    isLoading, 
    error, 
    recommendOperations, 
    getOperations, 
    updateOperations,
    clearError 
  } = useOperations();

  // Obtener daños confirmados del estado del wizard
  const confirmedDamages = state.confirmedDamages || [];

  // Cargar datos del assessment siempre que estemos en el paso de Operations
  useEffect(() => {
    if (state.assessmentId) {
      loadAssessmentData().catch((error) => {
        console.error('Error cargando datos del assessment:', error);
      });
    }
  }, [state.assessmentId]);

  // Cargar operaciones cuando hay daños confirmados
  useEffect(() => {
    if (state.assessmentId && confirmedDamages.length > 0 && operations.length === 0) {
      // Intentar obtener operaciones existentes primero
      getOperations(state.assessmentId).catch(() => {
              // Si no hay operaciones, generar recomendaciones
      if (state.assessmentId) {
        recommendOperations(state.assessmentId).catch((error) => {
          console.error('Error generando recomendaciones:', error);
        });
      }
      });
    }
  }, [state.assessmentId, confirmedDamages.length, operations.length, getOperations, recommendOperations]);

  const handleUpdateOperation = (mappingId: string, newOperation: DamageAction, reason: string) => {
    if (!state.assessmentId) return;

    const updatedOperations = operations.map(op => {
      if (op.mappingId === mappingId) {
        return {
          ...op,
          editedOperation: {
            main: {
              operation: newOperation,
              reason,
            },
            subOperations: op.proposedOperation?.subOperations || [],
          },
          effectiveOperation: {
            operation: newOperation,
            reason,
          },
          hasUserOverride: true,
        };
      }
      return op;
    });

    updateOperations(state.assessmentId, updatedOperations).catch((error) => {
      console.error('Error actualizando operación:', error);
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

  // Mostrar loading mientras se cargan las operaciones
  if (isLoading) {
    return (
      <PageShell
        header={
          <WizardStepperWithNav currentStep="operations" completedSteps={['intake', 'damages']} />
        }
        title="Operaciones de reparación"
        subtitle="Generando recomendaciones de operaciones..."
        content={
          <div className="flex justify-center items-center min-h-64">
            <ProgressCard
              title="Generando recomendaciones"
              description="Analizando daños confirmados para recomendar las mejores operaciones"
            />
          </div>
        }
      />
    );
  }

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <PageShell
        header={
          <WizardStepperWithNav currentStep="operations" completedSteps={['intake', 'damages']} />
        }
        title="Operaciones de reparación"
        subtitle="Error al cargar las operaciones"
        content={
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => clearError()}>Reintentar</Button>
          </div>
        }
      />
    );
  }

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
            {operations.map((operation) => (
              <RecommendedOperationCard
                key={operation.mappingId}
                operation={operation}
                onUpdateOperation={handleUpdateOperation}
              />
            ))}
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
