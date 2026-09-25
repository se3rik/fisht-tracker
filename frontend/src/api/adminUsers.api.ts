import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type {
    AdminUser,
    CreateUserRequest,
    GetAllUsersParams,
    ResetPasswordRequest,
    UpdateUserRequest,
} from '@/api/api-types/user';

const buildQuery = (params: GetAllUsersParams) => {
    const query = new URLSearchParams();

    if (params.search) query.set('search', params.search);
    if (params.department) query.set('department', params.department);
    if (params.role) query.set('role', params.role);
    if (params.isActive !== undefined) query.set('isActive', String(params.isActive));

    const queryString = query.toString();

    return queryString ? `?${queryString}` : '';
};

export const adminUsersApi = {
    getAll: (params: GetAllUsersParams = {}) => {
        return request<AdminUser[]>(`${endpoints.admin.users.base}${buildQuery(params)}`, {
            method: 'GET',
        });
    },
    create: (data: CreateUserRequest) => {
        return request<AdminUser>(endpoints.admin.users.base, {
            method: 'POST',
            body: data,
        });
    },
    update: (id: string, data: UpdateUserRequest) => {
        return request<AdminUser>(`${endpoints.admin.users.base}/${id}`, {
            method: 'PUT',
            body: data,
        });
    },
    resetPassword: (id: string, data: ResetPasswordRequest) => {
        return request<{ message: string }>(`${endpoints.admin.users.base}/${id}/password`, {
            method: 'PATCH',
            body: data,
        });
    },
    block: (id: string) => {
        return request<AdminUser>(`${endpoints.admin.users.base}/${id}/block`, {
            method: 'PATCH',
        });
    },
    unblock: (id: string) => {
        return request<AdminUser>(`${endpoints.admin.users.base}/${id}/unblock`, {
            method: 'PATCH',
        });
    },
};
