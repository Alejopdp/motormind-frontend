import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { Badge } from '@/components/atoms/Badge';
import { useWizardV2 } from '../hooks/useWizardV2';
import { PageShell } from '../components/PageShell';
import { SectionPaper } from '../components/SectionPaper';
import { WizardStepper } from '../components/WizardStepper';
import { OperationKind } from '../types';

const Operations = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, saveOperations, loadAssessmentData } = useWizardV2();

  // Obtener daños confirmados del estado del wizard
  const confirmedDamages = state.confirmedDamages || [];

  console.log('🔍 Operations component state:', {
    assessmentId: state.assessmentId,
    confirmedDamagesCount: confirmedDamages.length,
    status: state.status,
    currentStep: state.currentStep,
    confirmedDamages: confirmedDamages, // Log completo para debug
  });

  // Cargar datos del assessment siempre que estemos en el paso de Operations
  useEffect(() => {
    console.log('🔄 Operations useEffect triggered', {
      assessmentId: state.assessmentId,
      confirmedDamagesLength: confirmedDamages.length,
      status: state.status,
    });

    if (state.assessmentId) {
      console.log('🔄 Operations: Cargando datos del assessment...', {
        assessmentId: state.assessmentId,
        currentConfirmedDamages: confirmedDamages.length,
        status: state.status,
      });

      loadAssessmentData().catch((error) => {
        console.error('Error cargando datos del assessment:', error);
      });
    } else {
      console.log('⚠️ Operations: No hay assessmentId disponible');
    }
  }, [state.assessmentId]); // Removido loadAssessmentData para evitar bucle infinito

  // Función para mapear severidad del backend a formato del frontend
  const mapSeverity = (backendSeverity: string): 'leve' | 'medio' | 'grave' => {
    const severityMap: Record<string, 'leve' | 'medio' | 'grave'> = {
      SEV1: 'leve',
      SEV2: 'medio',
      SEV3: 'grave',
      leve: 'leve',
      medio: 'medio',
      grave: 'grave',
      LIGHT: 'leve',
      MEDIUM: 'medio',
      HEAVY: 'grave',
    };
    return severityMap[backendSeverity] || 'medio';
  };

  // Transformar daños confirmados a formato de operaciones
  const operations = confirmedDamages.map((damage: any, index: number) => ({
    id: `op-${index + 1}`,
    partName: damage.area || damage.partName || 'Pieza sin nombre',
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
      await saveOperations(operations);
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

  // Mostrar mensaje si no hay daños confirmados
  if (operations.length === 0) {
    return (
      <PageShell
        header={<WizardStepper currentStep="operations" completedSteps={['intake', 'damages']} />}
        title="Operaciones de reparación"
        subtitle="Define las operaciones necesarias para cada daño confirmado"
        content={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay daños confirmados</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron daños confirmados para definir operaciones.
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParams({ step: 'damages' });
                    navigate(`?step=damages`, { replace: true });
                  }}
                >
                  Volver a Daños
                </Button>
              </div>
            </div>
          </div>
        }
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
          {/* Info alert */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Los tiempos se calcularán automáticamente en 'Valoración'
              </p>
              <p className="mt-1 text-sm text-blue-700">
                Aquí solo defines el tipo de operación. Los costes y horas se mostrarán en el
                siguiente paso.
              </p>
            </div>
          </div>

          {/* Operations list */}
          <div className="space-y-4">
            {operations.map((op) => {
              const severityStyle = severityConfig[op.severity];
              return (
                <SectionPaper key={op.id}>
                  <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
                    {/* Left column - Part info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{op.partName}</h3>
                      <p className="text-sm text-gray-600">{op.damageType}</p>
                      <Badge variant="outline" className={severityStyle.color}>
                        {severityStyle.label}
                      </Badge>
                    </div>

                    {/* Right column - Operation selection */}
                    <div className="space-y-3 lg:col-span-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Operación principal
                        </label>
                        <Select
                          value={op.operation}
                          onValueChange={(value) => updateOperation(op.id, value as OperationKind)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PULIR">Pulir</SelectItem>
                            <SelectItem value="REPARAR">Reparar</SelectItem>
                            <SelectItem value="PINTAR">Pintar</SelectItem>
                            <SelectItem value="REPARAR_Y_PINTAR">Reparar y Pintar</SelectItem>
                            <SelectItem value="SUSTITUIR">Sustituir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          <Settings className="mr-1 h-4 w-4" />
                          Suplementos
                        </Button>
                        <span className="text-xs text-amber-700">Pendiente de valoración</span>
                      </div>
                    </div>
                  </div>
                </SectionPaper>
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
