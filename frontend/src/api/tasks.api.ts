import { request } from '@/api/base';
import { endpoints } from '@/api/endpoints';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';

type GetAllTasksParams = {
    name?: string;
    role?: TaskRoleValue;
    status?: TasksStatusValue;
    priority?: TaskPriorityValue;
    sortByDate?: 'asc' | 'desc';
};

export const tasksApi = {
    getAllTasks: async (params: GetAllTasksParams = {}) => {
        const query = new URLSearchParams();

        if (params.name) query.append('name', params.name);
        if (params.role) query.append('role', params.role);
        if (params.status) query.append('status', params.status.toUpperCase());
        if (params.priority) query.append('priority', params.priority);
        if (params.sortByDate) query.append('sortByDate', params.sortByDate);

        const url = query.toString()
            ? `${endpoints.tasks.getAllTasks}?${query.toString()}`
            : endpoints.tasks.getAllTasks;

        return request<TaskListItem[]>(url, { method: 'GET' });
    },
};
