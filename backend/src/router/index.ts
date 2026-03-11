import express from 'express';

import authController from '~/controllers/auth-controller.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/registration', authController.registration);
router.post('/logout', authController.logout);
router.get('/activate/:link', authController.activate);
router.get('/refresh', authController.refresh);
router.get('/users', authController.getUsers);

export default router;
