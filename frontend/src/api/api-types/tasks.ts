import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';
import type { TaskPriorityValue } from '@/types/task/TaskPriority';
import type { TasksStatusValue } from '@/types/task/TaskStatus';

export type Comment = {
    id: string;
    text: string;
    taskId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        firstName: string;
        secondName: string;
    };
};

export type TaskData = {
    id: string;
    name: string;
    description: string;
    status: TasksStatusValue;
    priority: TaskPriorityValue;
    executorId: string;
    answerableId: string;
    initiatorId: string;
    department: TaskDepartmentValues;
    createdAt: string;
    updatedAt: string;
    deadline?: string;
    executor: {
        id: string;
        firstName: string;
        secondName: string;
    };
    answerable: {
        id: string;
        firstName: string;
        secondName: string;
    };
    initiator: {
        id: string;
        firstName: string;
        secondName: string;
    };
    comments: Comment[] | [];
};
