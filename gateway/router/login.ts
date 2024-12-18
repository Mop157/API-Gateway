import express, { Router } from 'express';
const router: Router = express.Router();

import { registUser, loginUser } from '../auth_user/auth';

router.post('/regist', registUser);

router.post('/login', loginUser);

export default router
