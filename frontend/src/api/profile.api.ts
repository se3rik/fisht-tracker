import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type { ProfileDataResponse } from '@/api/api-types/profile';

export const profileApi = {
    getProfileData: async () => {
        return request<ProfileDataResponse>(endpoints.profile.getInfo, {
            method: 'GET',
        });
    },
};
