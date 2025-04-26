import { Diagnosis } from '../types/Diagnosis';
/**
 * Obtiene el síntoma procesado o el original si no existe el procesado
 * @param diagnosis Objeto de diagnóstico
 * @returns El síntoma procesado o el original
 */
export const getProcessedSymptom = (diagnosis: Diagnosis): string => {
    return diagnosis.processedFault?.symptomCleaned || diagnosis.fault;
};

/**
 * Obtiene la categoría del síntoma procesado o 'desconocido' si no existe
 * @param diagnosis Objeto de diagnóstico
 * @returns La categoría del síntoma
 */
export const getSymptomCategory = (diagnosis: Diagnosis): string => {
    return diagnosis.processedFault?.category || 'desconocido';
};

/**
 * Obtiene los códigos OBD del síntoma procesado o un array vacío si no existen
 * @param diagnosis Objeto de diagnóstico
 * @returns Los códigos OBD del síntoma
 */
export const getObdCodes = (diagnosis: Diagnosis): string[] => {
    return diagnosis.processedFault?.potentialObdCodes || [];
};

/**
 * Verifica si un diagnóstico tiene síntomas procesados
 * @param diagnosis Objeto de diagnóstico
 * @returns true si tiene síntomas procesados, false en caso contrario
 */
export const hasProcessedSymptom = (diagnosis: Diagnosis): boolean => {
    return !!diagnosis.processedFault;
}; 