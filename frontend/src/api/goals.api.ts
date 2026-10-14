import { request } from '@/api/base';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type GoalTask = { id: string; name: string; status: string };
export type Goal = {
    id: string;
    title: string;
    description: string;
    department: TaskDepartmentValues;
    deadline: string | null;
    status: GoalStatus;
    progress: number;
    creator: { id: string; firstName: string; secondName: string };
    tasks: GoalTask[];
};

export type GoalPayload = {
    title: string;
    description: string;
    department: TaskDepartmentValues;
    deadline: string | null;
    status?: GoalStatus;
    taskIds: string[];
};

export const goalsApi = {
    list: () => request<Goal[]>('/goals', { method: 'GET' }),
    taskOptions: (department: TaskDepartmentValues) =>
        request<GoalTask[]>(`/goals/task-options?department=${department}`, { method: 'GET' }),
    create: (data: GoalPayload) => request<Goal>('/goals', { method: 'POST', body: data }),
    update: (id: string, data: Partial<GoalPayload>) =>
        request<Goal>(`/goals/${id}`, { method: 'PATCH', body: data }),
};
