import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

export type ProfileDataResponse = {
    id: string;
    email: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    department: TaskDepartmentValues | null;
    speciality: string | null;
    roles: 'USER' | 'ADMIN';
};

export type UpdateProfileRequest = Partial<Omit<ProfileDataResponse, 'id'>>;
