import { useEffect, useState } from 'react';

import { tasksApi } from '@/api/tasks.api';
import { TASKS_CHANGED_EVENT } from '@/hooks/useLiveEvents';

import type { TaskListItem } from '@/types/task/TaskListItem';
import type { TasksStatusValue } from '@/types/task/TaskStatus';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TaskRoleValue } from '@/types/task/TaskRole';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

type Filters = {
    overview?: 'actionRequired' | 'overdue' | 'upcoming';
    name?: string;
    role?: TaskRoleValue;
    status?: TasksStatusValue;
    department?: TaskDepartmentValues;
    priority?: TaskPriorityValue;
    sortByDate?: 'asc' | 'desc';
    sortByDeadline?: 'asc' | 'desc';
    limit?: number;
    skip?: number;
};

export const useTasksList = (filters: Filters) => {
    const {
        overview,
        name,
        role,
        status,
        department,
        priority,
        sortByDate,
        sortByDeadline,
        limit,
        skip,
    } = filters;
    const [tasks, setTasks] = useState<TaskListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        let latestRequest = 0;
        const fetchTasks = async () => {
            const requestId = ++latestRequest;
            setIsLoading(true);
            setError(null);
            try {
                const data = await tasksApi.getAllTasks({
                    overview,
                    name,
                    role,
                    status,
                    department,
                    priority,
                    sortByDate,
                    sortByDeadline,
                    limit,
                    skip,
                });
                if (active && requestId === latestRequest) {
                    setTasks(data.tasks);
                    setTotal(data.total);
                }
            } catch (err) {
                if (active && requestId === latestRequest)
                    setError(err instanceof Error ? err.message : 'Ошибка загрузки задач');
            } finally {
                if (active && requestId === latestRequest) setIsLoading(false);
            }
        };

        void fetchTasks();
        window.addEventListener(TASKS_CHANGED_EVENT, fetchTasks);
        return () => {
            active = false;
            window.removeEventListener(TASKS_CHANGED_EVENT, fetchTasks);
        };
    }, [
        overview,
        name,
        role,
        status,
        department,
        priority,
        sortByDate,
        sortByDeadline,
        limit,
        skip,
    ]);

    return { tasks, total, isLoading, error };
};
