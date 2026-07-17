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
                ? { executors: { some: { id: userId } } }
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
                    executors: {
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
                executors: { select: { id: true, firstName: true, secondName: true } },
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
        const { executorIds, startDate, deadline, ...rest } = params;

        return prisma.task.create({
            data: {
                ...rest,
                executors: { connect: executorIds.map((id) => ({ id })) },
                startDate: startDate ? new Date(startDate) : undefined,
                deadline: deadline ? new Date(deadline) : undefined,
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
                executors: {
                    select: { id: true, firstName: true, secondName: true },
                },
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

        const { executorIds, deadline, ...rest } = data;

        return prisma.task.update({
            where: { id },
            data: {
                ...rest,
                ...(executorIds && {
                    executors: { set: executorIds.map((id) => ({ id })) },
                }),
                deadline: deadline ? new Date(deadline) : undefined,
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
