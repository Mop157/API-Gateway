import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { signToken, verifyToken } from "../services/jwtService";
import { checkPermission } from "../services/permissionService";
import User, { user } from '../models/User';
import dbPromise from "../config/database";
import languages from "../utils/Languag.json";

interface LanguagesType {
    [key: string]: {
        [key: string]: string;
    };
}

interface newRequest extends Request {
    body: user
}

const Languages: LanguagesType = languages

export const login = async (req: newRequest, res: Response): Promise<void> => {
    const { username, password, Language }: Pick<user, "username" | "password" | "Language"> = req.body;
    const user: user | null | undefined = await User.findByCredentials(username, password);
    if (!user) {
        res.status(404).json({ message: Languages['Incorrect login or password'][Language] });
        return
    }
    const token: string = signToken({ id: user.id, permissions: user.permissions, Language: Language });
    try {
        const db = await dbPromise
        await db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, user.id])
        res.status(201).json({
            message: Languages['token'][Language],
            token: token,
            id: user.id
        });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: Languages['error while requesting'][Language] });
    }
};

export const verifyAccess = async (req: newRequest, res: Response): Promise<void> => {
    const { token, path, Language } = req.body as Required<Pick<user, "token" | "path" | "Language">>
    const decoded: JwtPayload | null = verifyToken(token);
    if (!decoded || decoded instanceof Error) {
        res.status(401).json({ message: Languages['Token is invalid'][Language] });
        return
    }
    try {
        const db = await dbPromise
        const row = await db.get('SELECT id, token FROM users WHERE id = ? AND token = ?', [decoded.id, token]);

        if (!row) {
            res.status(402).json({ message: Languages["Token is invalid"][Language] });
            return
        }

        const hasAccess: boolean = await checkPermission(decoded.permissions, path);
        if (!hasAccess) {
            res.status(403).json({ message: Languages['Access Denie'][Language] });
            return
        }
        res.status(200).json({ message: Languages['Access granted'][Language], id: decoded.id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: Languages['error while requesting'][Language] });
    }
};

export const register = async (req: newRequest, res: Response): Promise<void> => {
    try {
        const { username, email, password, Language }: Pick<user, "username" | "email" | "password" | "Language"> = req.body;
    
        const existingUser: Error | null | undefined | user = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            res.status(401).json({ message: Languages['The user already exists'][Language] });
            return
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);
        const newUser: Error | null | Pick<user, "id" | "permissions" | "Language"> = await User.create(username, email, hashedPassword, Language);
        if (!newUser || newUser instanceof Error) {
            res.status(505).json({ message: Languages['error while requesting'][Language] })
            return
        }
        const token: string = signToken(newUser);
        const db = await dbPromise
        await db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, newUser.id])
        res.status(201).json({
            message: Languages["token"][Language],
            token: token,
            id: newUser.id
        });

    } catch {
        res.status(400).json({
            message: Languages["error while requesting"]["EN"]
        });
    }
};
