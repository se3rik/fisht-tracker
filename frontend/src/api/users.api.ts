import { request } from '@/api/base';

export type UserSearchResult = {
    id: string;
    firstName: string;
    secondName: string;
    department: string | null;
    speciality: string | null;
};

export const usersApi = {
    searchUsers: async (query: string) => {
        return request<UserSearchResult[]>(`/users/search?query=${query}`, {
            method: 'GET',
        });
    },
};
