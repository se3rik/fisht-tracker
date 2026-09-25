import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type {
    ChangePasswordRequest,
    ProfileDataResponse,
    UpdateProfileRequest,
} from '@/api/api-types/profile';

export const profileApi = {
    getProfileData: async () => {
        return request<ProfileDataResponse>(endpoints.profile.getInfo, {
            method: 'GET',
        });
    },

    updateProfileData: async (data: UpdateProfileRequest) => {
        return request<ProfileDataResponse>(endpoints.profile.updateData, {
            method: 'PUT',
            body: data,
        });
    },

    changePassword: (data: ChangePasswordRequest) => {
        return request<{ message: string }>(endpoints.profile.changePassword, {
            method: 'PATCH',
            body: data,
        });
    },
};
