import { Router } from 'express';
import { Auth } from '../middlewares/auth'

import * as UserController from '../controllers/userController';

const router = Router();

router.post('/signup', UserController.create);
router.post('/signin', UserController.authenticate)

router.get('/task/list', Auth.private, UserController.listTask)
router.post('/task/create', Auth.private, UserController.createTask)

export default router;