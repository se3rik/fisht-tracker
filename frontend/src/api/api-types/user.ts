import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

export type UserRoleValue = 'USER' | 'ADMIN';

export type AdminUser = {
    id: string;
    email: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    department: TaskDepartmentValues | null;
    speciality: string | null;
    roles: UserRoleValue;
    isActive: boolean;
};

export type GetAllUsersParams = {
    search?: string;
    department?: TaskDepartmentValues;
    role?: UserRoleValue;
    isActive?: boolean;
};

export type CreateUserRequest = {
    email: string;
    firstName: string;
    secondName: string;
    patronymic?: string;
    password: string;
    department?: TaskDepartmentValues;
    specialty?: string;
    roles?: UserRoleValue;
};

export type UpdateUserRequest = Partial<Omit<CreateUserRequest, 'password' | 'email'>>;

export type ResetPasswordRequest = {
    password: string;
};
