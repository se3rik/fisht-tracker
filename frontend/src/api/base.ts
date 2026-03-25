import { authApi } from '@/api/auth.api';

import { store } from '../stores/store';
import { forceLogout } from '@/stores/slices/authSlice';

import type { RequestOptions } from '@/api/api-types/request-options';

const BASE_API = 'http://localhost:3000/api';

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, _retry, ...rest } = options;

    const token = store.getState().auth.token;

    const response = await fetch(`${BASE_API}${url}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && !_retry) {
        try {
            await authApi.refresh({ _retry: true });

            return request<T>(url, {
                ...options,
                _retry: true,
            });
        } catch (error) {
            store.dispatch(forceLogout());
            throw new Error('Сессия истекла');
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
