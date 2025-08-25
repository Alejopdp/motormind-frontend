import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WizardStepKey } from '../types';
import { STEP_ORDER, getMaxEditableStep, isStepEditable } from './steps';
import { StepperNavProviderProps, StepperNavigationContextValue, StepMode } from './types';

const StepperNavigationContext = createContext<StepperNavigationContextValue | null>(null);

export const StepperNavigationProvider: React.FC<StepperNavProviderProps> = ({
  assessmentId,
  workflowStatus,
  currentStep,
  children,
  allowBackEdit = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Calcular el máximo paso editable según el workflow status
  const maxReachableStep = useMemo(() => {
    return getMaxEditableStep(workflowStatus);
  }, [workflowStatus]);

  // Determinar el modo del paso actual
  const mode = useMemo((): StepMode => {
    return isStepEditable(currentStep, workflowStatus, allowBackEdit) ? 'edit' : 'view';
  }, [currentStep, workflowStatus, allowBackEdit]);

  // Detectar si el usuario saltó hacia atrás desde un paso posterior
  const originStep = useMemo(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const maxIndex = STEP_ORDER.indexOf(maxReachableStep);

    // Si estamos en un paso anterior al máximo editable, probablemente saltamos hacia atrás
    if (currentIndex < maxIndex && mode === 'view') {
      return maxReachableStep;
    }

    return undefined;
  }, [currentStep, maxReachableStep, mode]);

  // Helper para obtener el siguiente paso
  const nextOf = useCallback((step: WizardStepKey): WizardStepKey => {
    const currentIndex = STEP_ORDER.indexOf(step);
    const nextIndex = Math.min(currentIndex + 1, STEP_ORDER.length - 1);
    return STEP_ORDER[nextIndex];
  }, []);

  // Helper para obtener el paso anterior
  const prevOf = useCallback((step: WizardStepKey): WizardStepKey => {
    const currentIndex = STEP_ORDER.indexOf(step);
    const prevIndex = Math.max(currentIndex - 1, 0);
    return STEP_ORDER[prevIndex];
  }, []);

  // Verificar si se puede navegar a un paso específico
  const canGoTo = useCallback(
    (step: WizardStepKey): boolean => {
      const stepIndex = STEP_ORDER.indexOf(step);
      const maxIndex = STEP_ORDER.indexOf(maxReachableStep);

      // Permitir navegar hacia atrás siempre, hacia adelante solo hasta maxReachableStep
      return stepIndex <= maxIndex;
    },
    [maxReachableStep],
  );

  // Navegar a un paso específico
  const goTo = useCallback(
    (step: WizardStepKey) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('step', step);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams],
  );

  // Comportamiento del CTA "Continuar"
  const continueFromHere = useCallback(() => {
    if (mode === 'view') {
      // En modo solo lectura, avanzar al siguiente paso sin side-effects
      const nextStep = nextOf(currentStep);
      goTo(nextStep);
    }
    // En modo edit, no hacer nada - cada página decide su comportamiento
  }, [mode, currentStep, nextOf, goTo]);

  // Verificar si un paso está en solo lectura
  const isReadOnly = useCallback(
    (step?: WizardStepKey): boolean => {
      const targetStep = step || currentStep;
      return !isStepEditable(targetStep, workflowStatus, allowBackEdit);
    },
    [currentStep, workflowStatus, allowBackEdit],
  );

  const contextValue: StepperNavigationContextValue = useMemo(
    () => ({
      assessmentId,
      currentStep,
      mode,
      maxReachableStep,
      originStep,
      workflowStatus,
      allowBackEdit,
      canGoTo,
      goTo,
      nextOf,
      prevOf,
      continueFromHere,
      isReadOnly,
    }),
    [
      assessmentId,
      currentStep,
      mode,
      maxReachableStep,
      originStep,
      workflowStatus,
      allowBackEdit,
      canGoTo,
      goTo,
      nextOf,
      prevOf,
      continueFromHere,
      isReadOnly,
    ],
  );

  return (
    <StepperNavigationContext.Provider value={contextValue}>
      {children}
    </StepperNavigationContext.Provider>
  );
};

export const useWizardStepNav = (): StepperNavigationContextValue => {
  const context = useContext(StepperNavigationContext);
  if (!context) {
    throw new Error('useWizardStepNav must be used within a StepperNavigationProvider');
  }
  return context;
};
