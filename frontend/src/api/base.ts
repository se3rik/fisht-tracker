import { authApi } from '@/api/auth.api';

const BASE_API = 'http://localhost:3000/api';

type RequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
    _retry?: boolean;
};

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, _retry, ...rest } = options;

    const response = await fetch(`${BASE_API}${url}`, {
        ...rest,
        headers: { 'Content-Type': 'application/json', ...headers },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && !_retry) {
        try {
            await authApi.refresh();

            return request<T>(url, {
                ...options,
                _retry: true,
            });
        } catch (error) {
            // Тут должна быть логика logout пользователя
            console.error('Refresh token failed');
            throw error;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API Error');
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
