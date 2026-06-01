import { prisma } from '../lib/prisma.js';

import ApiError from '~/exceptions/api-error.js';

import { TaskStatus } from '../../generated/prisma/enums.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { GetAllTasksParams, CreateTaskParams, UpdateTaskParams } from '~/types/tasks.js';

class TaskService {
    async getAllTasks({
        userId,
        name,
        role,
        status,
        department,
        priority,
        sortByDate,
        limit,
        skip,
    }: GetAllTasksParams) {
        const roleFilter =
            role === 'executor'
                ? { executorId: userId }
                : role === 'answerable'
                  ? { answerableId: userId }
                  : role === 'initiator'
                    ? { initiatorId: userId }
                    : {};

        const where: Prisma.TaskWhereInput = {
            ...roleFilter,
            ...(name && { name: { contains: name, mode: 'insensitive' } }),
            ...(status && { status }),
            ...(department && { department }),
            ...(priority && { priority }),
        };

        const [tasks, total] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: sortByDate ?? 'desc' },
                take: limit,
                skip,
                select: {
                    id: true,
                    name: true,
                    status: true,
                    priority: true,
                    department: true,
                    createdAt: true,
                    executor: {
                        select: {
                            firstName: true,
                            secondName: true,
                        },
                    },
                },
            }),
            prisma.task.count({ where }),
        ]);

        return { tasks, total };
    }

    async getTaskById(id: string) {
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                executor: { select: { id: true, firstName: true, secondName: true } },
                answerable: { select: { id: true, firstName: true, secondName: true } },
                initiator: { select: { id: true, firstName: true, secondName: true } },
                comments: {
                    include: {
                        author: { select: { id: true, firstName: true, secondName: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        return task;
    }

    async createTask(params: CreateTaskParams) {
        return prisma.task.create({
            data: {
                ...params,
                startDate: params.startDate ? new Date(params.startDate) : undefined,
                deadline: params.deadline ? new Date(params.deadline) : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                priority: true,
                department: true,
                startDate: true,
                deadline: true,
                executorId: true,
                answerableId: true,
                initiatorId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateTask(id: string, data: UpdateTaskParams) {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        return prisma.task.update({
            where: { id },
            data: {
                ...data,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
            },
        });
    }

    async deleteTask(id: string, userId: string, userRole: string) {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) throw ApiError.NotFound('Задача не найдена');

        const isInitiator = task.initiatorId === userId;
        const isAdmin = userRole === 'ADMIN';

        if (!isInitiator && !isAdmin) {
            throw ApiError.Forbidden('Недостаточно прав для удаления задачи');
        }

        return prisma.task.update({
            where: { id },
            data: { status: TaskStatus.ARCHIVE },
        });
    }
}

export default new TaskService();
