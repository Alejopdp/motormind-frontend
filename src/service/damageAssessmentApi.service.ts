import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '@/constants/env';

// Tipos ligeros para no enredar el tipado inicial del flujo por etapas
export interface DetectedDamagesResponse {
    detectedDamages: Array<Record<string, unknown>>;
    tchekAggregates: Record<string, unknown> | Array<unknown>;
    images: string[];
    car: Record<string, unknown> | null;
    workflow: Record<string, unknown> | null;
}

export interface IntakeResponse {
    id: string;
    workflow: Record<string, unknown> | null;
    tchekId?: string;
}

class DamageAssessmentApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: apiUrl,
            headers: { 'Content-Type': 'application/json' },
        });
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }

    async intake(body?: Partial<{ vehicleInfo: unknown; images: string[]; description: string }>): Promise<IntakeResponse> {
        const { data } = await this.api.post<IntakeResponse>('/damage-assessments/intakes', body ?? {});
        return data;
    }

    async getDetectedDamages(assessmentId: string): Promise<DetectedDamagesResponse> {
        const { data } = await this.api.get<DetectedDamagesResponse>(`/damage-assessments/${assessmentId}/damages`);
        return data;
    }

    async confirmDamages(assessmentId: string, confirmedDamageIds: string[], edits: Array<Record<string, unknown>> = []) {
        const { data } = await this.api.patch(`/damage-assessments/${assessmentId}/damages/confirm`, { confirmedDamageIds, edits });
        return data;
    }

    async generateOperations(assessmentId: string) {
        const { data } = await this.api.post(`/damage-assessments/${assessmentId}/operations/generate`, {});
        return data;
    }

    async editOperations(assessmentId: string, operations: Array<Record<string, unknown>>) {
        const { data } = await this.api.patch(`/damage-assessments/${assessmentId}/operations`, { operations });
        return data;
    }

    async generateValuation(assessmentId: string) {
        const { data } = await this.api.post(`/damage-assessments/${assessmentId}/valuation/generate`, {});
        return data;
    }

    async finalize(assessmentId: string) {
        const { data } = await this.api.patch(`/damage-assessments/${assessmentId}/finalize`, {});
        return data;
    }
}

const damageAssessmentApi = new DamageAssessmentApiService();
export default damageAssessmentApi;


