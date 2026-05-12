import type { Department, Specialty } from '../../generated/prisma/enums.js';

export type UpdateProfileData = {
    firstName?: string;
    secondName?: string;
    patronymic?: string | null;
    department?: Department | null;
    speciality?: Specialty | null;
};
