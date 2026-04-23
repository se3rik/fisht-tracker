import { useEffect, useState } from 'react';

import { tasksApi } from '@/api/tasks.api';

import type { TaskData } from '@/api/api-types/tasks';

export const useTasksItem = (id: string) => {
    const [taskData, setTaskData] = useState<TaskData>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaskData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (id) {
                    const data = await tasksApi.getTaskById(id);
                    setTaskData(data);
                } else {
                    setError('Не указан идентификатор задачи');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки задачи');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaskData();
    }, [id]);

    return { taskData, isLoading, error };
};
