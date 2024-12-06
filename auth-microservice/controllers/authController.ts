import bcrypt from "bcryptjs";
import sqlite3 from 'sqlite3';
import { Request, Response } from "express";

import { signToken, verifyToken } from "../services/jwtService";
import { checkPermission } from "../services/permissionService";
import User, { user } from '../models/User';
import db from "../config/database";
import Languages from "../utils/Languag.json";

interface newRequestbody {
    username: string
    password: string
    Language: string
    token: string
    path: string
}

interface newRequest extends Request {
    body: newRequestbody
}
export const login = async (req: newRequest, res: Response): Promise<void> => {
    const { username, password, Language }: Pick<newRequestbody, "username" & "password" & "Language"> = req.body;
    const user: user | Error | null | undefined = await User.findByCredentials(username, password);
    if (!user || user instanceof Error) {
        res.status(404).json({ message: Languages['Incorrect login or password'][Language] });
        return
    }
    const token = signToken({ id: user.id, permissions: user.permissions, Language: Language });
    db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, user.id], (err: Error): void => {
        if (err) {
            console.error(err);
        }
    })
    res.status(201).json({
        message: Languages['token'][Language],
        token: token,
        id: user.id
     });
};

exports.verifyAccess = async (req: newRequest, res: Response) => {
    const { token, path, Language } = req.body;
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: Languages['Token is invalid'][Language] });
    }

    db.get('SELECT id, token FROM users WHERE id = ? AND token = ?', [decoded.id, token], async (err, row) => {
        if (err) {
            console.error(err)
            return res.status(402).json({ message: Languages['Token is invalid'][Language] });
        } else if (row) {
            const hasAccess = await checkPermission(decoded.permissions, path);
            if (!hasAccess) {
                return res.status(403).json({ message: Languages['Access Denied'][Language] });
            }
            res.status(200).json({ message: Languages['Access granted'][Language], id: decoded.id });

        } else { return res.status(402).json({ message: Languages["Token is invalid"][Language] }); }
    })
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, Language } = req.body;
    

        const existingUser = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(401).json({ message: Languages['The user already exists'][Language] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create(username, email, hashedPassword, Language);

        const token = signToken(newUser);
        db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, newUser.id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'ERROR SERVER' });
            }
        })
        res.status(201).json({
            message: Languages["token"][Language],
            token: token,
            id: newUser.id
        });
    } catch {
        res.status(400).json({
            message: Languages["error while requesting"][Language]
        });
    }
};
