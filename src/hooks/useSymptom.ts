import { Diagnosis } from '@/types/Diagnosis';
import { getProcessedSymptom, getSymptomCategory, getObdCodes, hasProcessedSymptom } from '@/utils/symptom.utils';

/**
 * Hook para manejar síntomas procesados en componentes React
 * @param diagnosis Objeto de diagnóstico
 * @returns Objeto con funciones y valores relacionados con el síntoma
 */
export const useSymptom = (diagnosis: Diagnosis) => {
    return {
        // Obtener el síntoma procesado o el original
        symptom: getProcessedSymptom(diagnosis),

        // Obtener la categoría del síntoma
        category: getSymptomCategory(diagnosis),

        // Obtener los códigos OBD
        obdCodes: getObdCodes(diagnosis),

        // Verificar si tiene síntomas procesados
        hasProcessed: hasProcessedSymptom(diagnosis),

        // Obtener el síntoma original
        originalSymptom: diagnosis.fault,

        // Obtener el síntoma procesado completo
        processedSymptom: diagnosis.processedFault
    };
}; 