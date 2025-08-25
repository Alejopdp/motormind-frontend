import { useWizardStepNav } from '../nav';

export const useReadOnlyMode = () => {
    const { mode, continueFromHere, isReadOnly } = useWizardStepNav();

    return {
        isReadOnly: mode === 'view',
        isEditMode: mode === 'edit',
        mode,
        continueFromHere,
        isReadOnlyForStep: isReadOnly,
    };
};
