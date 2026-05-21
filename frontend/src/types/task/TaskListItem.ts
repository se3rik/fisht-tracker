import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

export type TaskListItem = {
    id: number;
    name: string;
    createdAt: string;
    status: TasksStatusValue;
    priority: TaskPriorityValue;
    executor: {
        firstName: string;
        secondName: string;
    };
};
