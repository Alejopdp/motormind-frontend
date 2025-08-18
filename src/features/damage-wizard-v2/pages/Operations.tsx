import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { useWizardV2 } from '../hooks/useWizardV2';
import { PageShell } from '../components/PageShell';
import { WizardStepper } from '../components/WizardStepper';
import { NoConfirmedDamagesMessage } from '../components/NoConfirmedDamagesMessage';
import { OperationsInfoAlert } from '../components/OperationsInfoAlert';
import { OperationCard } from '../components/OperationCard';
import { OperationKind, FrontendOperation } from '../types';
import { BackendDamage, DamageSeverity } from '../types/backend.types';

const Operations = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, saveOperations, loadAssessmentData } = useWizardV2();

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

  // Función para mapear severidad del backend a formato del frontend
  const mapSeverity = (backendSeverity: DamageSeverity): 'leve' | 'medio' | 'grave' => {
    const severityMap: Record<DamageSeverity, 'leve' | 'medio' | 'grave'> = {
      [DamageSeverity.SEV1]: 'leve',
      [DamageSeverity.SEV2]: 'medio',
      [DamageSeverity.SEV3]: 'grave',
      [DamageSeverity.SEV4]: 'grave',
      [DamageSeverity.SEV5]: 'grave',
    };
    return severityMap[backendSeverity] || 'medio';
  };

  // Transformar daños confirmados a formato de operaciones
  const operations: FrontendOperation[] = confirmedDamages.map((damage: BackendDamage, index: number) => ({
    id: `op-${index + 1}`,
    partName: damage.area || 'Pieza sin nombre',
    damageType: damage.description || damage.type || 'Daño detectado',
    severity: mapSeverity(damage.severity),
    operation: 'REPARAR' as OperationKind, // Operación por defecto
    originalDamage: damage, // Mantener referencia al daño original
  }));

  const updateOperation = (id: string, operation: OperationKind) => {
    // In a real implementation, this would update the state
    console.log(`Updated operation ${id} to ${operation}`);
  };

  const goValuation = async () => {
    try {
      await saveOperations(confirmedDamages);
      setParams({ step: 'valuation' });
      navigate(`?step=valuation`, { replace: true });
    } catch (error) {
      console.error('Error saving operations:', error);
      // Fallback a navegación directa en caso de error
      console.warn('Fallback: navegando a valuation después de error');
      setParams({ step: 'valuation' });
      navigate(`?step=valuation`, { replace: true });
    }
  };

  const severityConfig = {
    leve: { color: 'bg-green-100 text-green-800', label: 'Leve' },
    medio: { color: 'bg-yellow-100 text-yellow-800', label: 'Medio' },
    grave: { color: 'bg-red-100 text-red-800', label: 'Grave' },
  };

  const handleGoBack = () => {
    setParams({ step: 'damages' });
    navigate(`?step=damages`, { replace: true });
  };

  // Mostrar mensaje si no hay daños confirmados
  if (operations.length === 0) {
    return (
      <PageShell
        header={<WizardStepper currentStep="operations" completedSteps={['intake', 'damages']} />}
        title="Operaciones de reparación"
        subtitle="Define las operaciones necesarias para cada daño confirmado"
        content={<NoConfirmedDamagesMessage onGoBack={handleGoBack} />}
      />
    );
  }

  return (
    <PageShell
      header={<WizardStepper currentStep="operations" completedSteps={['intake', 'damages']} />}
      title="Operaciones de reparación"
      subtitle="Define las operaciones necesarias para cada daño confirmado"
      content={
        <>
          <OperationsInfoAlert />

          {/* Operations list */}
          <div className="space-y-4">
            {operations.map((op) => (
              <OperationCard
                key={op.id}
                operation={op}
                severityConfig={severityConfig}
                onUpdateOperation={updateOperation}
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
