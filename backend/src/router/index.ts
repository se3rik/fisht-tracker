import express from 'express';
import { body } from 'express-validator';

import authController from '~/controllers/auth-controller.js';
import profileController from '~/controllers/profile-controller.js';

import authMiddleware from '~/middlewares/auth-middleware.js';

import { Department, Specialty } from '../../generated/prisma/enums.js';

const router = express.Router();

// Auth
router.post('/login', authController.login);
router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({
        min: 3,
        max: 32,
    }),
    authController.registration,
);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

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

export default router;
