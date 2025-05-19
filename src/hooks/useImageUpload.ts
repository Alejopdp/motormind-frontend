import { useApi } from './useApi';
import { UploadResult } from '@/service/upload.service';
import { AxiosError } from 'axios';

export function useImageUpload() {
    const { execute: uploadRequest } = useApi<UploadResult>('post', '/upload');

    const upload = async (files: File[], context = 'damage-assessment') => {
        const formData = new FormData();

        // Asegurarnos de que se envíen los archivos con el nombre correcto
        files.forEach((file) => {
            formData.append('files', file, file.name);
        });
        formData.append('context', context);

        try {
            // Enviar el FormData directamente
            const response = await uploadRequest(formData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message || 'Error subiendo imágenes');
        }
    };

    return { upload };
} 