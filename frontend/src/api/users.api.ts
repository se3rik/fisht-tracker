import { request } from '@/api/base';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

export type DirectoryUser = {
    id: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    department: TaskDepartmentValues | null;
    speciality: string | null;
};

export type UserSearchResult = {
    id: string;
    firstName: string;
    secondName: string;
    department?: string | null;
    speciality?: string | null;
};

export const usersApi = {
    getDirectoryUsers: () => request<DirectoryUser[]>('/users/directory'),
    searchUsers: async (query: string) => {
        return request<UserSearchResult[]>(`/users/search?query=${query}`, {
            method: 'GET',
        });
    },
    getAssignableUsers: () => request<UserSearchResult[]>('/users/assignable', { method: 'GET' }),
};
