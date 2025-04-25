import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiUrl } from '@/constants/env';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para agregar el token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  // Métodos específicos para evaluaciones de diagnósticos
  async getDiagnosisEvaluations(): Promise<{ evaluations: AiDiagnosisEvaluation[]; total: number }> {
    const response = await this.get<{ evaluations: AiDiagnosisEvaluation[]; total: number }>(`/audit/evaluations`);
    return response.data;
  }

  async getDiagnosisEvaluationById(id: string): Promise<AiDiagnosisEvaluation> {
    const response = await this.get<AiDiagnosisEvaluation>(`/audit/evaluations/${id}`);
    return response.data;
  }

  async getDiagnosisEvaluationsByDiagnosisId(diagnosisId: string): Promise<AiDiagnosisEvaluation[]> {
    const response = await this.get<AiDiagnosisEvaluation[]>(`/audit/evaluations/diagnosis/${diagnosisId}`);
    return response.data;
  }
}

export default ApiService.getInstance();
