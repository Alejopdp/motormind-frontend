import { apiUrl } from '@/constants/env';
import axios from 'axios';

export interface UploadResult {
    keys: string[];
}

export async function uploadImages({
    files,
    context = 'damage-assessment',
}: {
    files: File[];
    context?: string;
}): Promise<UploadResult> {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });
    formData.append('context', context);

    try {
        const res = await axios.post<UploadResult>(`${apiUrl}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err: any) {
        if (err.response?.data?.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error('Error subiendo imágenes');
    }
} 