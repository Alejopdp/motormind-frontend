import { Prompt } from '@/types/prompt';
import apiService from './api.service';

export const promptService = {
    getAllPrompts: async (): Promise<Prompt[]> => {
        const response = await apiService.get<Prompt[]>('/prompts');
        return response.data;
    },

    getPromptById: async (id: string): Promise<Prompt> => {
        const response = await apiService.get<Prompt>(`/prompts/${id}`);
        return response.data;
    },

    getPromptByPhase: async (phase: string): Promise<Prompt> => {
        const response = await apiService.get<Prompt>(`/prompts/${phase}`);
        return response.data;
    },

    createPromptVersion: async (phase: string, content: string): Promise<Prompt> => {
        const response = await apiService.post<Prompt>(`/prompts/${phase}/version`, { content });
        return response.data;
    },

    changeActiveVersion: async (phase: string, versionIndex: number): Promise<Prompt> => {
        const response = await apiService.patch<Prompt>(`/prompts/${phase}/use-version/${versionIndex}`);
        return response.data;
    }
}; 