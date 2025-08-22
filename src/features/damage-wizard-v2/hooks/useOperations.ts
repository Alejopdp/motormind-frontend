import { useState, useCallback } from 'react';
import damageAssessmentApi from '@/service/damageAssessmentApi.service';
import { BackendOperation, DamageAction } from '../types';

interface UseOperationsReturn {
  operations: BackendOperation[];
  isLoading: boolean;
  error: string | null;
  generateOperations: (assessmentId: string) => Promise<void>;
  clearError: () => void;
}

export const useOperations = (): UseOperationsReturn => {
  const [operations, setOperations] = useState<BackendOperation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateOperations = useCallback(async (assessmentId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Generando operaciones...');
      const response = await damageAssessmentApi.generateOperations(assessmentId);

      // Transformar la respuesta del backend al formato del frontend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendOperations: BackendOperation[] = response.gtMotiveMappings?.map((mapping: any) => {
        // Asegurar que tenemos una operación efectiva válida
        const effectiveOperation = mapping.editedOperation?.main || mapping.proposedOperation?.main || {
          operation: 'REPAIR' as DamageAction,
          reason: 'Operación por defecto',
          confidence: 0,
          source: 'default'
        };

        return {
          mappingId: mapping._id || mapping.gtMotivePartName,
          partName: mapping.gtMotivePartName,
          partCode: mapping.gtMotivePartCode,
          proposedOperation: mapping.proposedOperation,
          editedOperation: mapping.editedOperation,
          effectiveOperation,
          hasUserOverride: !!mapping.editedOperation,
        };
      }) || [];

      setOperations(backendOperations);
      console.log(`✅ Operaciones generadas: ${backendOperations.length} operaciones`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generando operaciones';
      console.error('❌ Error generando operaciones:', errorMessage);
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
    generateOperations,
    clearError,
  };
};
