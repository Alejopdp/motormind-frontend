import { useState } from 'react';
import { WizardStepper, type WizardStep } from '../components/WizardStepper';

/**
 * Ejemplo de uso del WizardStepper con paridad 1:1 al prototipo del repo de diseño.
 * 
 * Casos de prueba:
 * 1. Estado inicial - solo 'intake' activo
 * 2. Progreso normal - completando pasos secuencialmente 
 * 3. Navegación - click en pasos completados/actuales
 * 4. Estados finales - todos los pasos completados
 */
export const WizardStepperExample = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intake');
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);

  const handleStepClick = (step: WizardStep) => {
    console.log('Step clicked:', step);
    setCurrentStep(step);
  };

  const handleNext = () => {
    const steps: WizardStep[] = ['intake', 'damages', 'operations', 'valuation', 'finalize'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      // Marcar el paso actual como completado
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      // Avanzar al siguiente paso
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleReset = () => {
    setCurrentStep('intake');
    setCompletedSteps([]);
  };

  const handleCompleteAll = () => {
    const allSteps: WizardStep[] = ['intake', 'damages', 'operations', 'valuation'];
    setCompletedSteps(allSteps);
    setCurrentStep('finalize');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* WizardStepper - exactamente como aparece en el wizard */}
      <WizardStepper 
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      
      {/* Controles de prueba */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Controles de Prueba</h2>
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              disabled={currentStep === 'finalize'}
            >
              Siguiente Paso
            </button>
            
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Reiniciar
            </button>
            
            <button 
              onClick={handleCompleteAll}
              className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors"
            >
              Completar Todo
            </button>
          </div>
          
          <div className="space-y-2">
            <p><strong>Paso Actual:</strong> {currentStep}</p>
            <p><strong>Pasos Completados:</strong> {completedSteps.join(', ') || 'Ninguno'}</p>
          </div>
        </div>

        {/* Información de paridad visual */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h3 className="text-md font-semibold mb-3">✅ Paridad Visual Verificada</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Layout:</strong> bg-card + border-b, max-w-7xl, padding 16px</p>
            <p>• <strong>Estados:</strong> current (primary), completed (success), upcoming (muted)</p>
            <p>• <strong>Iconos:</strong> números 1-5, check para completados</p>
            <p>• <strong>Conectores:</strong> ArrowRight entre pasos</p>
            <p>• <strong>Tipografía:</strong> text-sm font-medium + text-xs descriptions</p>
            <p>• <strong>Interacción:</strong> hover states, click en completed/current</p>
          </div>
        </div>
      </div>
    </div>
  );
};
