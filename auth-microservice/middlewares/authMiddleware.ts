import { NextFunction, Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "../services/jwtService";

interface newRequest extends Request {
    user?: JwtPayload
}

export const auth = (req: newRequest, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.headers['authorization'];
    if (!token) {
        res.status(418).json({ message: 'Токен не надано' });
        return
    }
    const decoded: JwtPayload | null = verifyToken(token);
    if (!decoded) {
        res.status(418).json({ message: 'Неправильний токен' });
        return
    }
    req.user = decoded
    next();
};
