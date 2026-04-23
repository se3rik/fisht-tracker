import { TaskStatus, TaskPriority, Department } from '../../generated/prisma/enums.js';

export type TaskRole = 'all' | 'executor' | 'answerable' | 'initiator';

export type SortOrder = 'asc' | 'desc';

export type GetAllTasksParams = {
    userId: string;
    name?: string;
    role?: TaskRole;
    status?: TaskStatus;
    priority?: TaskPriority;
    sortByDate?: SortOrder;
};

export type CreateTaskParams = {
    name: string;
    description: string;
    priority: TaskPriority;
    executorId: string;
    answerableId: string;
    initiatorId: string;
    department: Department;
    deadline?: string;
};

export type UpdateTaskParams = {
    name?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    executorId?: string;
    answerableId?: string;
    department?: Department;
    deadline?: string;
};
