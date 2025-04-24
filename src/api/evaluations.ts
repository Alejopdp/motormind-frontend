import { AiDiagnosisEvaluation } from '../types/Diagnosis';
import apiService from '../service/api.service';

export const getEvaluation = async (evaluationId: string): Promise<AiDiagnosisEvaluation> => {
    try {
        const { data } = await apiService.get<{ data: AiDiagnosisEvaluation }>(`/audit/evaluations/${evaluationId}`);
        return data.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error al obtener la evaluación: ${error.message}`);
        }
        throw new Error('Error al obtener la evaluación');
    }
}; 