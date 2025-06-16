import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { DamageAssessment, Damage } from '@/types/DamageAssessment';
import { ApiService } from '@/service/api.service';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

// Tipos para el flujo de creación (mantener compatibilidad)
interface DamageAssessmentCreationData {
  images: File[];
  details: string;
  insuranceCompany: string;
  claimNumber: string;
}

// Tipos para el estado completo del contexto
interface DamageAssessmentContextState {
  // Estados de carga y datos
  isLoading: boolean;
  damageAssessment: DamageAssessment | null;
  error: string | null;

  // Datos para creación (compatibilidad hacia atrás)
  creationData: DamageAssessmentCreationData;

  // Estado de edición
  editingDamageId: string | null;
  isUpdating: boolean;
}

interface DamageAssessmentContextType {
  // Estado
  state: DamageAssessmentContextState;

  // Métodos para creación (mantener compatibilidad)
  setImages: (images: File[]) => void;
  setDetails: (details: string) => void;
  setInsuranceCompany: (insuranceCompany: string) => void;
  setClaimNumber: (claimNumber: string) => void;
  reset: () => void;

  // Métodos para manejo del damage assessment completo
  loadDamageAssessment: (id: string) => Promise<void>;
  refreshDamageAssessment: () => Promise<void>;

  // Métodos para edición de damages
  updateDamage: (damageId: string, damageData: Partial<Damage>) => Promise<void>;
  deleteDamage: (damageId: string) => Promise<void>;

  // Estados de edición
  startEditingDamage: (damageId: string) => void;
  stopEditingDamage: () => void;

  // Utilidades
  getDamageById: (damageId: string) => Damage | undefined;
  isEditingDamage: (damageId: string) => boolean;
}

const initialState: DamageAssessmentContextState = {
  isLoading: false,
  damageAssessment: null,
  error: null,
  creationData: { images: [], details: '' },
  editingDamageId: null,
  isUpdating: false,
};

const DamageAssessmentContext = createContext<DamageAssessmentContextType | undefined>(undefined);

export const DamageAssessmentProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DamageAssessmentContextState>(initialState);
  const queryClient = useQueryClient();
  const apiService = ApiService.getInstance();

  // Métodos para creación (mantener compatibilidad hacia atrás)
  const setImages = useCallback((images: File[]) => {
    setState((prevState) => ({
      ...prevState,
      creationData: { ...prevState.creationData, images },
    }));
  }, []);

  const setDetails = useCallback((details: string) => {
    setState((prevState) => ({
      ...prevState,
      creationData: { ...prevState.creationData, details },
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Método para cargar un damage assessment específico
  const loadDamageAssessment = useCallback(
    async (id: string) => {
      // No recargar si ya tenemos el mismo assessment
      if (state.damageAssessment?._id === id && !state.error) {
        return;
      }

      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await apiService.get<DamageAssessment>(`/damage-assessments/${id}`);

        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          damageAssessment: response.data,
          error: null,
        }));
      } catch {
        const errorMessage = 'Error al cargar el peritaje de daños';

        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: errorMessage,
        }));

        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    },
    [apiService, state.damageAssessment?._id, state.error],
  );

  // Método para refrescar el damage assessment actual
  const refreshDamageAssessment = useCallback(async () => {
    if (!state.damageAssessment?._id) return;

    await loadDamageAssessment(state.damageAssessment._id);
  }, [loadDamageAssessment, state.damageAssessment?._id]);

  // Método para actualizar un damage
  const updateDamage = useCallback(
    async (damageId: string, damageData: Partial<Damage>) => {
      if (!state.damageAssessment?._id) return;

      setState((prevState) => ({
        ...prevState,
        isUpdating: true,
      }));

      try {
        const updatedAssessment = await apiService.updateDamage(
          state.damageAssessment._id,
          damageId,
          damageData,
        );

        setState((prevState) => ({
          ...prevState,
          damageAssessment: updatedAssessment,
          isUpdating: false,
          editingDamageId: null,
        }));

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({
          queryKey: ['damageAssessment', state.damageAssessment._id],
        });
        queryClient.invalidateQueries({ queryKey: ['damageAssessments'] });

        enqueueSnackbar('Daño actualizado correctamente', { variant: 'success' });
      } catch {
        setState((prevState) => ({
          ...prevState,
          isUpdating: false,
        }));

        enqueueSnackbar('Error al actualizar el daño', { variant: 'error' });
      }
    },
    [apiService, state.damageAssessment?._id, queryClient],
  );

  // Método para eliminar un damage
  const deleteDamage = useCallback(
    async (damageId: string) => {
      if (!state.damageAssessment?._id) return;

      setState((prevState) => ({
        ...prevState,
        isUpdating: true,
      }));

      try {
        const updatedAssessment = await apiService.deleteDamage(
          state.damageAssessment._id,
          damageId,
        );

        setState((prevState) => ({
          ...prevState,
          damageAssessment: updatedAssessment,
          isUpdating: false,
          editingDamageId: null,
        }));

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({
          queryKey: ['damageAssessment', state.damageAssessment._id],
        });
        queryClient.invalidateQueries({ queryKey: ['damageAssessments'] });

        enqueueSnackbar('Daño eliminado correctamente', { variant: 'success' });
      } catch {
        setState((prevState) => ({
          ...prevState,
          isUpdating: false,
        }));

        enqueueSnackbar('Error al eliminar el daño', { variant: 'error' });
      }
    },
    [apiService, state.damageAssessment?._id, queryClient],
  );

  // Métodos para manejo del estado de edición
  const startEditingDamage = useCallback((damageId: string) => {
    setState((prevState) => ({
      ...prevState,
      editingDamageId: damageId,
    }));
  }, []);

  const stopEditingDamage = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      editingDamageId: null,
    }));
  }, []);

  // Utilidades
  const getDamageById = useCallback(
    (damageId: string): Damage | undefined => {
      return state.damageAssessment?.damages.find((damage) => damage._id === damageId);
    },
    [state.damageAssessment?.damages],
  );

  const isEditingDamage = useCallback(
    (damageId: string): boolean => {
      return state.editingDamageId === damageId;
    },
    [state.editingDamageId],
  );

  const contextValue: DamageAssessmentContextType = {
    state,

    // Métodos de creación (compatibilidad)
    setImages,
    setDetails,
    reset,

    // Métodos del damage assessment completo
    loadDamageAssessment,
    refreshDamageAssessment,

    // Métodos de edición
    updateDamage,
    deleteDamage,

    // Estados de edición
    startEditingDamage,
    stopEditingDamage,

    // Utilidades
    getDamageById,
    isEditingDamage,
  };

  return (
    <DamageAssessmentContext.Provider value={contextValue}>
      {children}
    </DamageAssessmentContext.Provider>
  );
};

export const useDamageAssessment = () => {
  const ctx = useContext(DamageAssessmentContext);
  if (!ctx) throw new Error('useDamageAssessment debe usarse dentro de DamageAssessmentProvider');
  return ctx;
};

// Hook de compatibilidad para mantener la API anterior
export const useDamageAssessmentCreation = () => {
  const ctx = useDamageAssessment();

  return {
    data: ctx.state.creationData,
    setImages: ctx.setImages,
    setDetails: ctx.setDetails,
    reset: ctx.reset,
  };
};

// Hook específico para el manejo del damage assessment completo
export const useDamageAssessmentDetail = () => {
  const ctx = useDamageAssessment();

  return {
    damageAssessment: ctx.state.damageAssessment,
    isLoading: ctx.state.isLoading,
    error: ctx.state.error,
    isUpdating: ctx.state.isUpdating,
    loadDamageAssessment: ctx.loadDamageAssessment,
    refreshDamageAssessment: ctx.refreshDamageAssessment,
    updateDamage: ctx.updateDamage,
    deleteDamage: ctx.deleteDamage,
    startEditingDamage: ctx.startEditingDamage,
    stopEditingDamage: ctx.stopEditingDamage,
    getDamageById: ctx.getDamageById,
    isEditingDamage: ctx.isEditingDamage,
    editingDamageId: ctx.state.editingDamageId,
  };
};
