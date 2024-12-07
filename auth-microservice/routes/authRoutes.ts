import express, { Router } from "express";

import { login, register, verifyAccess } from "../controllers/authController";

const router: Router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verifyAccess', verifyAccess);

export default router;
