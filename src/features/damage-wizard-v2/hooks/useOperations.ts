import { useState, useCallback } from 'react';
import damageAssessmentApi from '@/service/damageAssessmentApi.service';
import { BackendOperation } from '../types';

interface UseOperationsReturn {
  operations: BackendOperation[];
  isLoading: boolean;
  error: string | null;
  recommendOperations: (assessmentId: string) => Promise<void>;
  getOperations: (assessmentId: string) => Promise<void>;
  updateOperations: (assessmentId: string, operations: BackendOperation[]) => Promise<void>;
  clearError: () => void;
}

export const useOperations = (): UseOperationsReturn => {
  const [operations, setOperations] = useState<BackendOperation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const recommendOperations = useCallback(async (assessmentId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Generando recomendaciones de operaciones...');
      const response = await damageAssessmentApi.recommendOperations(assessmentId);
      
      // Transformar la respuesta del backend al formato del frontend
      const backendOperations: BackendOperation[] = response.gtMotiveMappings?.map((mapping: any) => ({
        mappingId: mapping._id || mapping.gtMotivePartName,
        partName: mapping.gtMotivePartName,
        partCode: mapping.gtMotivePartCode,
        proposedOperation: mapping.proposedOperation,
        editedOperation: mapping.editedOperation,
        effectiveOperation: mapping.editedOperation?.main || mapping.proposedOperation?.main,
        hasUserOverride: !!mapping.editedOperation,
      })) || [];

      setOperations(backendOperations);
      console.log(`✅ Recomendaciones generadas: ${backendOperations.length} operaciones`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generando recomendaciones';
      console.error('❌ Error generando recomendaciones:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOperations = useCallback(async (assessmentId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📖 Obteniendo operaciones...');
      const response = await damageAssessmentApi.getOperations(assessmentId);
      
      const backendOperations: BackendOperation[] = response.operations?.map((op: any) => ({
        mappingId: op.mappingId,
        partName: op.partName,
        partCode: op.partCode,
        proposedOperation: op.proposedOperation,
        editedOperation: op.editedOperation,
        effectiveOperation: op.effectiveOperation,
        hasUserOverride: op.hasUserOverride,
      })) || [];

      setOperations(backendOperations);
      console.log(`✅ Operaciones obtenidas: ${backendOperations.length} operaciones`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo operaciones';
      console.error('❌ Error obteniendo operaciones:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOperations = useCallback(async (assessmentId: string, updatedOperations: BackendOperation[]): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('✏️ Actualizando operaciones...');
      
      // Transformar al formato esperado por el backend
      const backendPayload = updatedOperations.map(op => ({
        mappingId: op.mappingId,
        operation: op.effectiveOperation.operation,
        reason: op.effectiveOperation.reason,
      }));

      await damageAssessmentApi.updateOperations(assessmentId, backendPayload);
      
      setOperations(updatedOperations);
      console.log(`✅ Operaciones actualizadas: ${updatedOperations.length} operaciones`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando operaciones';
      console.error('❌ Error actualizando operaciones:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    operations,
    isLoading,
    error,
    recommendOperations,
    getOperations,
    updateOperations,
    clearError,
  };
};
