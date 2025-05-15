import { useState } from 'react';
import { uploadImages, UploadResult } from '../service/upload.service';

export function useImageUpload() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<UploadResult | null>(null);

    const upload = async (files: File[], context = 'damage-assessment') => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await uploadImages({ files, context });
            setResult(res);
            return res;
        } catch (err: any) {
            setError(err.message || 'Error subiendo imágenes');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { upload, loading, error, result };
} 