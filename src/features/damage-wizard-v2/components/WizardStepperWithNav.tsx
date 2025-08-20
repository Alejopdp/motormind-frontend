import { useWizardStepNav, STEP_ORDER } from '../nav';
import { WizardStepper } from './WizardStepper';
import { WizardStepKey } from '../types';

interface WizardStepperWithNavProps {
  currentStep: WizardStepKey;
  completedSteps?: WizardStepKey[];
}

export const WizardStepperWithNav: React.FC<WizardStepperWithNavProps> = ({
  currentStep,
  completedSteps = [],
}) => {
  const { canGoTo, goTo } = useWizardStepNav();

  const handleStepClick = (step: WizardStepKey) => {
    // Siempre permitir navegación hacia atrás
    const stepIndex = STEP_ORDER.indexOf(step);
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    // Permitir navegar hacia atrás siempre, hacia adelante solo si canGoTo permite
    if (stepIndex < currentIndex || canGoTo(step)) {
      goTo(step);
    }
  };

  return (
    <WizardStepper
      currentStep={currentStep}
      completedSteps={completedSteps}
      onStepClick={handleStepClick}
    />
  );
};
