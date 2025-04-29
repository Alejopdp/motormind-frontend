import { Prompt } from '../types/prompt';
import { api } from '../api/api';

export const promptService = {
    getAllPrompts: async (): Promise<Prompt[]> => {
        const response = await api.get<Prompt[]>('/prompts');
        return response.data;
    },

    getPromptByPhase: async (phase: string): Promise<Prompt> => {
        const response = await api.get<Prompt>(`/prompts/${phase}`);
        return response.data;
    },

    createPromptVersion: async (phase: string, content: string): Promise<Prompt> => {
        const response = await api.post<Prompt>(`/prompts/${phase}/version`, { content });
        return response.data;
    },

    changeActiveVersion: async (phase: string, versionIndex: number): Promise<Prompt> => {
        const response = await api.patch<Prompt>(`/prompts/${phase}/use-version/${versionIndex}`);
        return response.data;
    }
}; 