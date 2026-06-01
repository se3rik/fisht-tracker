import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';
import type { TaskData, Comment, CreateTaskDto, UpdateTaskDto } from '@/api/api-types/tasks';

type GetAllTasksParams = {
    name?: string;
    role?: TaskRoleValue;
    status?: TasksStatusValue;
    department?: TaskDepartmentValues;
    priority?: TaskPriorityValue;
    sortByDate?: 'asc' | 'desc';
    limit?: number;
    skip?: number;
};

export const tasksApi = {
    getAllTasks: async (params: GetAllTasksParams = {}) => {
        const query = new URLSearchParams();

        if (params.name) query.append('name', params.name);
        if (params.role) query.append('role', params.role);
        if (params.status) query.append('status', params.status.toUpperCase());
        if (params.department) query.append('department', params.department);
        if (params.priority) query.append('priority', params.priority);
        if (params.sortByDate) query.append('sortByDate', params.sortByDate);
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.skip) query.append('skip', params.skip.toString());

        const url = query.toString()
            ? `${endpoints.tasks.getAllTasks}?${query.toString()}`
            : endpoints.tasks.getAllTasks;

        return request<{ tasks: TaskListItem[]; total: number }>(url, { method: 'GET' });
    },

    getTaskById: async (id: string) => {
        const url = `${endpoints.tasks.getTaskById}/${id}`;
        return request<TaskData>(url, {
            method: 'GET',
        });
    },

    createTask: async (data: CreateTaskDto) => {
        return request<TaskData>('/tasks', {
            method: 'POST',
            body: data,
        });
    },

    updateTask: async (id: string, data: Partial<UpdateTaskDto>) => {
        return request(`/tasks/${id}`, {
            method: 'PATCH',
            body: data,
        });
    },

    createComment: async (taskId: string, text: string) => {
        return request<Comment>(`/tasks/${taskId}/comments`, {
            method: 'POST',
            body: { text },
        });
    },

    deleteComment: async (taskId: string, commentId: string) => {
        return request(`/tasks/${taskId}/comments/${commentId}`, {
            method: 'DELETE',
        });
    },
};
