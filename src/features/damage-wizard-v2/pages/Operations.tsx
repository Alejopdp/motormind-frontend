import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const { operations, isLoading, error, loadOperations, generateOperations, clearError } = useOperations();
  const [showRegenerateButton, setShowRegenerateButton] = useState(false);

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

  // Cargar operaciones existentes o generar nuevas si es necesario
  useEffect(() => {
    if (state.assessmentId && confirmedDamages.length > 0 && operations.length === 0) {
      console.log(
        '🔄 Operations: Cargando operaciones para',
        confirmedDamages.length,
        'daños confirmados',
      );

      // Primero intentar cargar operaciones existentes
      loadOperations(state.assessmentId!).then(() => {
        // Si se cargaron operaciones exitosamente, mostrar botón de regenerar
        setShowRegenerateButton(true);
      }).catch((error) => {
        console.error('❌ Operations: Error cargando operaciones:', error);
        // Si no hay operaciones existentes, generar nuevas
        generateOperations(state.assessmentId!).catch((genError) => {
          console.error('❌ Operations: Error generando operaciones:', genError);
        });
      });
    }
  }, [state.assessmentId, confirmedDamages.length, operations.length, loadOperations, generateOperations]);

  const handleUpdateOperation = (mappingId: string, newOperation: DamageAction, reason: string) => {
    if (!state.assessmentId) return;

    // Por ahora, solo logueamos el cambio ya que no tenemos endpoint de actualización
    console.log('🔄 Operations: Actualización de operación:', {
      mappingId,
      newOperation,
      reason,
    });

    // TODO: Implementar actualización cuando se necesite
    // Por ahora, las operaciones se generan una vez y no se editan
  };

  const handleRegenerateOperations = async () => {
    if (!state.assessmentId) return;
    
    if (window.confirm('¿Estás seguro de que quieres regenerar las operaciones? Esto sobrescribirá las recomendaciones actuales.')) {
      try {
        await generateOperations(state.assessmentId, true);
        setShowRegenerateButton(false);
      } catch (error) {
        console.error('❌ Operations: Error regenerando operaciones:', error);
      }
    }
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
          <div className="flex min-h-64 items-center justify-center">
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
          <div className="py-8 text-center">
            <p className="mb-4 text-red-600">{error}</p>
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

          {/* Botón de regenerar operaciones */}
          {showRegenerateButton && operations.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button
                onClick={handleRegenerateOperations}
                variant="outline"
                className="text-sm"
              >
                🔄 Regenerar operaciones
              </Button>
            </div>
          )}

          {/* Operations list */}
          <div className="space-y-4">
            {operations.map((operation) => {
              // Intentar encontrar el daño relacionado basándose en el nombre de la parte
              const relatedDamage = confirmedDamages.find(
                (damage) =>
                  damage.subarea?.toLowerCase().includes(operation.partName.toLowerCase()) ||
                  damage.area?.toLowerCase().includes(operation.partName.toLowerCase()) ||
                  operation.partName.toLowerCase().includes(damage.subarea?.toLowerCase() || '') ||
                  operation.partName.toLowerCase().includes(damage.area?.toLowerCase() || ''),
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
