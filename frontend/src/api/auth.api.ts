import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type { AuthResponse } from '@/api/api-types/auth';

export const authApi = {
    registration: (email: string, firstName: string, secondName: string, password: string) => {
        return request<AuthResponse>(endpoints.auth.registration, {
            method: 'POST',
            body: { email, firstName, secondName, password },
        });
    },
    login: (email: string, password: string) => {
        return request<AuthResponse>(endpoints.auth.login, {
            method: 'POST',
            body: { email, password },
        });
    },
    logout: () => {
        return request<{ message: string }>(endpoints.auth.logout, {
            method: 'POST',
        });
    },
    refresh: () => {
        return request<AuthResponse>(endpoints.auth.refresh, {
            method: 'GET',
        });
    },
};
