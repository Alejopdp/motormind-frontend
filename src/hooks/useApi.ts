import { useState, useCallback } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import apiService from '../service/api.service';

export interface UseApiResponse<T, D = unknown> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    execute: (data?: D, queryParams?: Record<string, unknown>, pathParams?: Record<string, string>) => Promise<AxiosResponse<T>>;
}

type ApiMethod = 'get' | 'post' | 'put' | 'delete';

interface RequestData {
    [key: string]: unknown;
}

export function useApi<ResponseType, RequestType extends RequestData = RequestData>(
    method: ApiMethod,
    url: string,
    defaultConfig: AxiosRequestConfig = {}
): UseApiResponse<ResponseType, RequestType> {
    const [data, setData] = useState<ResponseType | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const execute = useCallback(
        async (requestData?: RequestType, queryParams?: Record<string, unknown>, pathParams?: Record<string, string>) => {
            try {
                setLoading(true);
                setError(null);

                // Reemplazar parámetros en la URL
                let finalUrl = url;
                if (pathParams) {
                    Object.keys(pathParams).forEach(key => {
                        finalUrl = finalUrl.replace(`:${key}`, pathParams[key]);
                    });
                }

                const config = {
                    ...defaultConfig,
                    params: { ...queryParams }
                };
                let response: AxiosResponse<ResponseType>;

                switch (method) {
                    case 'get':
                        response = await apiService.get<ResponseType>(finalUrl, config);
                        break;
                    case 'post':
                        response = await apiService.post<ResponseType>(finalUrl, requestData, config);
                        break;
                    case 'put':
                        response = await apiService.put<ResponseType>(finalUrl, requestData, config);
                        break;
                    case 'delete':
                        response = await apiService.delete<ResponseType>(finalUrl, {
                            ...config,
                            data: requestData
                        });
                        break;
                    default:
                        throw new Error(`Método HTTP no soportado: ${method}`);
                }

                setData(response.data);
                return response;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Error desconocido');
                setError(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [method, url, defaultConfig]
    );

    return { data, error, loading, execute };
}