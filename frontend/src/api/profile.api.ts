import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type { ProfileDataResponse, UpdateProfileRequest } from '@/api/api-types/profile';

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
};
