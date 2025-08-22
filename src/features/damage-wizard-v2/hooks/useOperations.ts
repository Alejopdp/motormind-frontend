import { useState, useCallback } from 'react';
import damageAssessmentApi from '@/service/damageAssessmentApi.service';
import { BackendOperation, DamageAction } from '../types';

interface UseOperationsReturn {
  operations: BackendOperation[];
  isLoading: boolean;
  error: string | null;
  loadOperations: (assessmentId: string) => Promise<void>;
  generateOperations: (assessmentId: string, force?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useOperations = (): UseOperationsReturn => {
  const [operations, setOperations] = useState<BackendOperation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadOperations = useCallback(async (assessmentId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Cargando operaciones existentes...');
      const response = await damageAssessmentApi.getAssessment(assessmentId);

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
      console.log(`✅ Operaciones cargadas: ${backendOperations.length} operaciones`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando operaciones';
      console.error('❌ Error cargando operaciones:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateOperations = useCallback(async (assessmentId: string, force: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🔍 ${force ? 'Regenerando' : 'Generando'} operaciones...`);
      const url = force ? `${assessmentId}?force=true` : assessmentId;
      const response = await damageAssessmentApi.generateOperations(url);

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
      console.log(`✅ Operaciones ${force ? 'regeneradas' : 'generadas'}: ${backendOperations.length} operaciones`);

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
    loadOperations,
    generateOperations,
    clearError,
  };
};
