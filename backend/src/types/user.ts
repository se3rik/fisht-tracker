// types/user.ts (или где у тебя лежит GetAllTasksParams)
import type { Department, UserRole } from '../../generated/prisma/enums.js';

export type GetAllUsersParams = {
    search?: string;
    department?: Department;
    role?: UserRole;
    isActive?: boolean;
};
