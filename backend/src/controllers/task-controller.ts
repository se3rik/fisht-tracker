import type { Request, Response, NextFunction } from 'express';

import taskService from '~/services/task-service.js';

import ApiError from '~/exceptions/api-error.js';

import { TaskStatus, TaskPriority, Department } from '../../generated/prisma/enums.js';

class TaskController {
    async getOverview(_req: Request, res: Response, next: NextFunction) {
        try {
            const overview = await taskService.getOverview(res.locals.user.id);
            res.json(overview);
        } catch (error) {
            next(error);
        }
    }

    async getAllTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: userId } = res.locals.user;
            const {
                name,
                role,
                status,
                department,
                priority,
                sortByDate,
                sortByDeadline,
                limit,
                skip,
                overview,
            } = req.query;

            const tasks = await taskService.getAllTasks({
                userId,
                overview: ['actionRequired', 'overdue', 'upcoming'].includes(String(overview))
                    ? (overview as 'actionRequired' | 'overdue' | 'upcoming')
                    : undefined,
                name: name as string | undefined,
                role: role as any | undefined,
                status: status as TaskStatus | undefined,
                department: department as Department | undefined,
                priority: priority as TaskPriority | undefined,
                sortByDate: sortByDate as 'asc' | 'desc' | undefined,
                sortByDeadline: sortByDeadline as 'asc' | 'desc' | undefined,
                limit: limit ? Number(limit) : undefined,
                skip: skip ? Number(skip) : undefined,
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
            const task = await taskService.createTask(req.body, res.locals.user.id);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw ApiError.BadRequest('Id задачи не указан');

            const task = await taskService.updateTask(id as string, req.body, res.locals.user.id);
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
