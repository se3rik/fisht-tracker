import { useEffect, useState } from 'react';

import { tasksApi } from '@/api/tasks.api';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

type Filters = {
    name?: string;
    role?: TaskRoleValue;
    status?: TasksStatusValue;
    department?: TaskDepartmentValues;
    priority?: TaskPriorityValue;
    sortByDate?: 'asc' | 'desc';
    limit?: number;
    skip?: number;
};

export const useTasksList = (filters: Filters) => {
    const [tasks, setTasks] = useState<TaskListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await tasksApi.getAllTasks(filters);
                setTasks(data.tasks);
                setTotal(data.total);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки задач');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [
        filters.name,
        filters.role,
        filters.status,
        filters.department,
        filters.priority,
        filters.sortByDate,
        filters.limit,
        filters.skip,
    ]);

    return { tasks, total, isLoading, error };
};
