import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export type WizardStep = 'intake' | 'damages' | 'operations' | 'valuation' | 'finalize';

interface Step {
  key: WizardStep;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { key: 'intake', label: 'Datos Iniciales', description: 'Subir imágenes y datos del vehículo' },
  { key: 'damages', label: 'Daños', description: 'Revisar y confirmar daños detectados' },
  { key: 'operations', label: 'Operaciones', description: 'Definir operaciones de reparación' },
  { key: 'valuation', label: 'Valoración', description: 'Revisar costes y precios finales' },
  {
    key: 'finalize',
    label: 'Finalizar',
    description: 'Completar evaluación y generar presupuesto',
  },
];

interface WizardStepperProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
  completedSteps?: WizardStep[];
}

export const WizardStepper = ({
  currentStep,
  onStepClick,
  completedSteps = [],
}: WizardStepperProps) => {
  const currentStepIndex = STEPS.findIndex((step) => step.key === currentStep);

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(STEPS[stepIndex].key)) {
      return 'completed';
    }
    if (stepIndex === currentStepIndex) {
      return 'current';
    }
    if (stepIndex < currentStepIndex) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="bg-card border-border border-b">
      <div className="mx-auto max-w-7xl p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = onStepClick && (status === 'completed' || status === 'current');

            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-3 transition-colors',
                    status === 'current' && 'bg-primary-muted/20 border-primary-muted',
                    status === 'completed' && 'bg-success-muted/20',
                    isClickable && 'hover:bg-muted/50 cursor-pointer',
                    !isClickable && 'cursor-default',
                  )}
                  onClick={isClickable ? () => onStepClick(step.key) : undefined}
                >
                  {/* Step Icon */}
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                      status === 'completed' && 'bg-success text-success-foreground',
                      status === 'current' && 'bg-primary text-primary-foreground',
                      status === 'upcoming' && 'bg-muted text-muted-foreground border-border border',
                    )}
                  >
                    {status === 'completed' ? <Check className="h-4 w-4" /> : index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        status === 'current' && 'text-primary',
                        status === 'completed' && 'text-success',
                        status === 'upcoming' && 'text-muted',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-muted truncate text-xs">{step.description}</p>
                  </div>
                </div>

                {/* Arrow between steps */}
                {index < STEPS.length - 1 && (
                  <ArrowRight className="text-muted-foreground mx-2 h-4 w-4 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
