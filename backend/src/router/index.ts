import express from 'express';
import { body } from 'express-validator';

import authController from '~/controllers/auth-controller.js';
import profileController from '~/controllers/profile-controller.js';
import taskController from '~/controllers/task-controller.js';
import commentController from '~/controllers/comment-controller.js';
import userController from '~/controllers/user-controller.js';

import authMiddleware from '~/middlewares/auth-middleware.js';
import adminMiddleware from '~/middlewares/admin-middleware.js';

import { Department, Specialty } from '../../generated/prisma/enums.js';

const router = express.Router();

// Auth
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

// Admin: управление пользователями
router.post(
    '/admin/users',
    authMiddleware,
    adminMiddleware,
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    body('firstName').isString().isLength({ min: 1, max: 64 }),
    body('secondName').isString().isLength({ min: 1, max: 64 }),
    userController.createUser,
);

router.put(
    '/admin/users/:id',
    authMiddleware,
    adminMiddleware,
    body('firstName').optional().isString().isLength({ min: 1, max: 64 }),
    body('secondName').optional().isString().isLength({ min: 1, max: 64 }),
    body('patronymic').optional({ nullable: true }).isString().isLength({ max: 64 }),
    body('department').optional({ nullable: true }).isIn(Object.values(Department)),
    body('specialty').optional({ nullable: true }).isIn(Object.values(Specialty)),
    userController.updateUser,
);

router.patch(
    '/admin/users/:id/password',
    authMiddleware,
    adminMiddleware,
    body('password').isLength({ min: 3, max: 32 }),
    userController.resetPassword,
);

router.patch('/admin/users/:id/block', authMiddleware, adminMiddleware, userController.blockUser);
router.patch(
    '/admin/users/:id/unblock',
    authMiddleware,
    adminMiddleware,
    userController.unblockUser,
);

// Profile
router.get('/profile', authMiddleware, profileController.getProfile);
router.put(
    '/updateProfile',
    authMiddleware,
    body('firstName').optional().isString().isLength({ min: 1, max: 64 }),
    body('secondName').optional().isString().isLength({ min: 1, max: 64 }),
    body('patronymic').optional({ nullable: true }).isString().isLength({ max: 64 }),
    body('department').optional({ nullable: true }).isIn(Object.values(Department)),
    body('specialty').optional({ nullable: true }).isIn(Object.values(Specialty)),
    profileController.updateProfile,
);
router.patch(
    '/profile/password',
    authMiddleware,
    body('oldPassword').isString().notEmpty(),
    body('newPassword').isLength({ min: 3, max: 32 }),
    profileController.changePassword,
);

// Users
router.get('/users/search', authMiddleware, userController.searchUsers);
router.get('/admin/users', authMiddleware, adminMiddleware, userController.getAllUsers);

// Tasks
router.get('/tasks', authMiddleware, taskController.getAllTasks);
router.get('/tasks/:id', authMiddleware, taskController.getTaskById);
router.post('/tasks', authMiddleware, taskController.createTask);
router.patch('/tasks/:id', authMiddleware, taskController.updateTask);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);
// Tasks-Comments
router.post('/tasks/:id/comments', authMiddleware, commentController.createComment);
router.delete(
    '/tasks/:taskId/comments/:commentId',
    authMiddleware,
    commentController.deleteComment,
);

export default router;
