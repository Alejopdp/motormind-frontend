import { WizardStepKey, WorkflowStatus } from '../types';

export type StepMode = 'edit' | 'view';

export interface StepperNavProviderProps {
    assessmentId: string;
    workflowStatus: WorkflowStatus;
    currentStep: WizardStepKey;
    children: React.ReactNode;
    allowBackEdit?: boolean;
}

export interface StepperNavigationState {
    assessmentId: string;
    currentStep: WizardStepKey;
    mode: StepMode;
    maxReachableStep: WizardStepKey;
    originStep?: WizardStepKey;
    workflowStatus: WorkflowStatus;
    allowBackEdit: boolean;
}

export interface StepperNavigationContextValue extends StepperNavigationState {
    canGoTo: (step: WizardStepKey) => boolean;
    goTo: (step: WizardStepKey) => void;
    nextOf: (step: WizardStepKey) => WizardStepKey;
    prevOf: (step: WizardStepKey) => WizardStepKey;
    continueFromHere: () => void;
    isReadOnly: (step?: WizardStepKey) => boolean;
}
