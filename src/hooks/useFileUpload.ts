import { useState } from 'react';
import { AxiosError } from 'axios';
import apiService from '@/service/api.service';

interface UploadResult {
    keys: string[];
}

interface UseFileUploadResponse {
    upload: (
        files: File[],
        extraFields?: Record<string, string>,
        context?: string
    ) => Promise<UploadResult>;
    isLoading: boolean;
    error: Error | null;
}

export function useFileUpload(): UseFileUploadResponse {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const upload = async (
        files: File[],
        extraFields: Record<string, string> = {},
        context = 'damage-assessment'
    ): Promise<UploadResult> => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file, file.name);
        });
        formData.append('context', context);
        Object.entries(extraFields).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await apiService.post<UploadResult>('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            console.log(err);
            const axiosError = err as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || 'Error subiendo archivos';
            const error = new Error(errorMessage);
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        upload,
        isLoading,
        error,
    };
} 