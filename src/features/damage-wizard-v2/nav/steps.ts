import { WizardStepKey, WorkflowStatus } from '../types';

export const STEP_ORDER: WizardStepKey[] = ['intake', 'damages', 'operations', 'valuation', 'finalize'];

export function stepFromWorkflow(status: WorkflowStatus): WizardStepKey {
    switch (status) {
        case 'processing':
        case 'detected':
            return 'damages';
        case 'damages_confirmed':
        case 'operations_defined':
            return 'operations';
        case 'valuated':
            return 'valuation';
        case 'completed':
            return 'finalize';
        default:
            return 'damages';
    }
}

export function getStepIndex(step: WizardStepKey): number {
    return STEP_ORDER.indexOf(step);
}

export function getMaxEditableStep(workflowStatus: WorkflowStatus): WizardStepKey {
    return stepFromWorkflow(workflowStatus);
}

export function getMaxEditableIndex(workflowStatus: WorkflowStatus): number {
    return getStepIndex(getMaxEditableStep(workflowStatus));
}

export function isStepEditable(currentStep: WizardStepKey, workflowStatus: WorkflowStatus, allowBackEdit: boolean = false): boolean {
    if (allowBackEdit) {
        return true;
    }

    const currentIndex = getStepIndex(currentStep);
    const maxEditableIndex = getMaxEditableIndex(workflowStatus);

    // Si estamos en finalize y no está completado, permitir edición para cerrar
    if (currentStep === 'finalize' && workflowStatus !== 'completed') {
        return true;
    }

    return currentIndex <= maxEditableIndex;
}
