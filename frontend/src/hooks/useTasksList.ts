import { useEffect, useState } from 'react';

import { tasksApi } from '@/api/tasks.api';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';

type Filters = {
    name?: string;
    role?: TaskRoleValue;
    status?: TasksStatusValue;
    priority?: TaskPriorityValue;
    sortByDate?: 'asc' | 'desc';
};

export const useTasksList = (filters: Filters) => {
    const [tasks, setTasks] = useState<TaskListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await tasksApi.getAllTasks(filters);
                setTasks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки задач');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [filters.name, filters.role, filters.status, filters.priority, filters.sortByDate]);

    return { tasks, isLoading, error };
};
