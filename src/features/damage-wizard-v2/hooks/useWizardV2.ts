/**
 * Hook principal para manejar el estado y lógica del Wizard V2
 * Combina el contexto con la lógica de negocio y llamadas al API
 */

import { useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useWizardV2 as useWizardV2Context } from '../context/WizardV2Context';
import damageAssessmentApi, { DetectedDamagesResponse } from '@/service/damageAssessmentApi.service';
import {
  adaptDamagesResponse,
  adaptValuationResponse,
  prepareIntakePayload,
  prepareConfirmDamagesPayload,
} from '../api/adapter';
import { BackendDamagesResponse } from '../types/backend.types';
import {
  POLLING_INTERVAL,
  MAX_POLLING_ATTEMPTS,
  extractStepFromUrl,
  createWizardUrl,
  logger,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../utils/constants';

// ============================================================================
// TIPOS PARA EL HOOK
// ============================================================================

interface UseWizardV2Return {
  // Estado del contexto
  state: ReturnType<typeof useWizardV2Context>['state'];
  
  // Acciones básicas
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  resetWizard: () => void;
  
  // Navegación
  goToStep: (step: 'intake' | 'damages' | 'operations' | 'valuation' | 'finalize') => void;
  goNext: () => void;
  goBack: () => void;
  
  // Acciones del flujo
  startIntake: (data: IntakeData) => Promise<void>;
  confirmDamages: (confirmedIds: string[]) => Promise<void>;
  saveOperations: (operations: any[]) => Promise<void>;
  generateValuation: () => Promise<void>;
  finalizeAssessment: () => Promise<void>;
  
  // Utilidades
  isCurrentStep: (step: string) => boolean;
  canNavigateToStep: (step: string) => boolean;
}

interface IntakeData {
  plate: string;
  claimDescription: string;
  images: string[];
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useWizardV2 = (): UseWizardV2Return => {
  const context = useWizardV2Context();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  
  const { state, dispatch, setLoading, setError, resetWizard } = context;
  const assessmentId = params.id || state.assessmentId;

  // Función temporal para convertir respuesta del API a formato esperado
  const convertApiResponse = (response: DetectedDamagesResponse): BackendDamagesResponse => {
    return {
      detectedDamages: response.detectedDamages as any[], // Conversión temporal
      tchekAggregates: response.tchekAggregates,
      images: response.images,
      car: response.car as any,
      workflow: response.workflow as any,
    };
  };

  // ============================================================================
  // NAVEGACIÓN
  // ============================================================================

  const goToStep = useCallback((step: typeof state.currentStep) => {
    if (!assessmentId) {
      logger.error('No assessment ID available for navigation');
      return;
    }
    
    const url = createWizardUrl(assessmentId, step);
    navigate(url);
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, [assessmentId, navigate, dispatch]);

  const goNext = useCallback(() => {
    const stepOrder: (typeof state.currentStep)[] = ['intake', 'damages', 'operations', 'valuation', 'finalize'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    
    if (currentIndex < stepOrder.length - 1 && state.canGoNext) {
      goToStep(stepOrder[currentIndex + 1]);
    }
  }, [state.currentStep, state.canGoNext, goToStep]);

  const goBack = useCallback(() => {
    const stepOrder: (typeof state.currentStep)[] = ['intake', 'damages', 'operations', 'valuation', 'finalize'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    
    if (currentIndex > 0) {
      goToStep(stepOrder[currentIndex - 1]);
    }
  }, [state.currentStep, goToStep]);

  // ============================================================================
  // UTILIDADES DE NAVEGACIÓN
  // ============================================================================

  const isCurrentStep = useCallback((step: string) => {
    return state.currentStep === step;
  }, [state.currentStep]);

  const canNavigateToStep = useCallback((step: string) => {
    const stepOrder = ['intake', 'damages', 'operations', 'valuation', 'finalize'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    const targetIndex = stepOrder.indexOf(step);
    
    // Puede navegar hacia atrás o al paso actual
    if (targetIndex <= currentIndex) return true;
    
    // Para navegar hacia adelante, necesita haber completado los pasos anteriores
    switch (step) {
      case 'damages':
        return state.status !== 'idle' && state.status !== 'processing';
      case 'operations':
        return state.status === 'damages_confirmed' || state.status === 'operations_defined' || 
               state.status === 'valuated' || state.status === 'completed';
      case 'valuation':
        return state.status === 'operations_defined' || state.status === 'valuated' || 
               state.status === 'completed';
      case 'finalize':
        return state.status === 'valuated' || state.status === 'completed';
      default:
        return false;
    }
  }, [state.currentStep, state.status]);

  // ============================================================================
  // POLLING PARA DETECCIÓN DE DAÑOS
  // ============================================================================

  const pollForDamages = useCallback(async (assessmentId: string): Promise<void> => {
    let attempts = 0;
    
    const poll = async (): Promise<boolean> => {
      try {
        attempts++;
        logger.debug(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`);
        
        const response = await damageAssessmentApi.getDetectedDamages(assessmentId);
        const convertedResponse = convertApiResponse(response);
        const adaptedResponse = adaptDamagesResponse(convertedResponse);
        
        if (adaptedResponse.workflow?.status !== 'processing') {
          // Detección completa
          dispatch({ type: 'SET_DETECTED_DAMAGES', payload: adaptedResponse.damages });
          logger.info('Damage detection completed', { 
            damagesCount: adaptedResponse.damages.length,
            status: adaptedResponse.workflow?.status 
          });
          return true;
        }
        
        // Aún procesando
        if (attempts >= MAX_POLLING_ATTEMPTS) {
          throw new Error(ERROR_MESSAGES.PROCESSING_TIMEOUT);
        }
        
        return false;
      } catch (error) {
        logger.error('Polling error:', error);
        
        if (attempts >= MAX_POLLING_ATTEMPTS) {
          throw error;
        }
        
        return false;
      }
    };
    
    // Polling inicial inmediato
    const completed = await poll();
    if (completed) return;
    
    // Polling con intervalo
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const completed = await poll();
          if (completed) {
            clearInterval(interval);
            resolve();
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, POLLING_INTERVAL);
    });
  }, [dispatch]);

  // ============================================================================
  // ACCIONES DEL FLUJO
  // ============================================================================

  const startIntake = useCallback(async (data: IntakeData): Promise<void> => {
    try {
      setLoading(true);
      setError(undefined);
      
      logger.info('Starting intake', { plate: data.plate, imagesCount: data.images.length });
      
      // Actualizar estado local primero
      dispatch({ 
        type: 'START_INTAKE', 
        payload: {
          plate: data.plate,
          claimDescription: data.claimDescription,
          images: data.images,
        }
      });
      
      // Llamada al backend
      const payload = prepareIntakePayload(data);
      const response = await damageAssessmentApi.intake(payload);
      
      dispatch({
        type: 'INTAKE_SUCCESS',
        payload: {
          assessmentId: response.id,
          status: response.workflow?.status === 'processing' ? 'processing' : 'detected',
        }
      });
      
      // Si está procesando, iniciar polling
      if (response.workflow?.status === 'processing') {
        logger.info('Starting damage detection polling');
        await pollForDamages(response.id);
      } else {
        // Si ya está detectado, cargar daños directamente
        const damagesResponse = await damageAssessmentApi.getDetectedDamages(response.id);
        const convertedResponse = convertApiResponse(damagesResponse);
        const adaptedResponse = adaptDamagesResponse(convertedResponse);
        dispatch({ type: 'SET_DETECTED_DAMAGES', payload: adaptedResponse.damages });
      }
      
      logger.info(SUCCESS_MESSAGES.INTAKE_CREATED);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      logger.error('Intake failed:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, dispatch, pollForDamages]);

  const confirmDamages = useCallback(async (confirmedIds: string[]): Promise<void> => {
    if (!assessmentId) {
      throw new Error(ERROR_MESSAGES.ASSESSMENT_NOT_FOUND);
    }
    
    try {
      setLoading(true);
      setError(undefined);
      
      logger.info('Confirming damages', { confirmedCount: confirmedIds.length });
      
      const payload = prepareConfirmDamagesPayload(confirmedIds);
      await damageAssessmentApi.confirmDamages(assessmentId, payload.confirmedDamageIds, payload.edits);
      
      dispatch({ type: 'CONFIRM_DAMAGES', payload: confirmedIds });
      
      logger.info(SUCCESS_MESSAGES.DAMAGES_CONFIRMED);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      logger.error('Damage confirmation failed:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [assessmentId, setLoading, setError, dispatch]);

  const saveOperations = useCallback(async (operations: any[]): Promise<void> => {
    if (!assessmentId) {
      throw new Error(ERROR_MESSAGES.ASSESSMENT_NOT_FOUND);
    }
    
    try {
      setLoading(true);
      setError(undefined);
      
      logger.info('Saving operations', { operationsCount: operations.length });
      
      // Primero generar operaciones si no existen
      if (!state.operations?.length) {
        await damageAssessmentApi.generateOperations(assessmentId);
      }
      
      // Luego guardar cambios
      await damageAssessmentApi.editOperations(assessmentId, operations);
      
      dispatch({ type: 'SET_OPERATIONS', payload: operations });
      
      logger.info(SUCCESS_MESSAGES.OPERATIONS_SAVED);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      logger.error('Operations save failed:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [assessmentId, state.operations, setLoading, setError, dispatch]);

  const generateValuation = useCallback(async (): Promise<void> => {
    if (!assessmentId) {
      throw new Error(ERROR_MESSAGES.ASSESSMENT_NOT_FOUND);
    }
    
    try {
      setLoading(true);
      setError(undefined);
      
      logger.info('Generating valuation');
      
      const response = await damageAssessmentApi.generateValuation(assessmentId);
      const adaptedValuation = adaptValuationResponse(response);
      
      dispatch({ type: 'SET_VALUATION', payload: adaptedValuation });
      
      logger.info(SUCCESS_MESSAGES.VALUATION_GENERATED);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      logger.error('Valuation generation failed:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [assessmentId, setLoading, setError, dispatch]);

  const finalizeAssessment = useCallback(async (): Promise<void> => {
    if (!assessmentId) {
      throw new Error(ERROR_MESSAGES.ASSESSMENT_NOT_FOUND);
    }
    
    try {
      setLoading(true);
      setError(undefined);
      
      logger.info('Finalizing assessment');
      
      await damageAssessmentApi.finalize(assessmentId);
      
      dispatch({ type: 'FINALIZE_SUCCESS' });
      
      logger.info(SUCCESS_MESSAGES.ASSESSMENT_FINALIZED);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      logger.error('Assessment finalization failed:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [assessmentId, setLoading, setError, dispatch]);

  // ============================================================================
  // SINCRONIZACIÓN CON URL
  // ============================================================================

  useEffect(() => {
    const stepFromUrl = extractStepFromUrl();
    if (stepFromUrl && stepFromUrl !== state.currentStep) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepFromUrl });
    }
  }, [searchParams, state.currentStep, dispatch]);

  // ============================================================================
  // RETURN DEL HOOK
  // ============================================================================

  return {
    state,
    setLoading,
    setError,
    resetWizard,
    goToStep,
    goNext,
    goBack,
    startIntake,
    confirmDamages,
    saveOperations,
    generateValuation,
    finalizeAssessment,
    isCurrentStep,
    canNavigateToStep,
  };
};

export default useWizardV2;
