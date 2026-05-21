import type { Request, Response, NextFunction } from 'express';

import taskService from '~/services/task-service.js';

import ApiError from '~/exceptions/api-error.js';

import { TaskStatus, TaskPriority } from '../../generated/prisma/enums.js';

class TaskController {
    async getAllTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: userId } = res.locals.user;
            const { name, role, status, priority, sortByDate } = req.query;

            const tasks = await taskService.getAllTasks({
                userId,
                name: name as string | undefined,
                role: role as any | undefined,
                status: status as TaskStatus | undefined,
                priority: priority as TaskPriority | undefined,
                sortByDate: sortByDate as 'asc' | 'desc' | undefined,
            });

            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw ApiError.BadRequest('Id задачи не указан');

            const task = await taskService.getTaskById(id as string);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await taskService.createTask(req.body);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw ApiError.BadRequest('Id задачи не указан');

            const task = await taskService.updateTask(id as string, req.body);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { id: userId, roles } = res.locals.user;

            const task = await taskService.deleteTask(id as string, userId, roles);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }
}

export default new TaskController();
