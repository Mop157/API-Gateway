import jwt, { JwtPayload } from "jsonwebtoken";

import Config from "../config/config";

const jwtSecret: string = Config.jwtSecret || "123456789"

type JWT = {
    id: number,
    permissions: string,
    Language: string
}

export const signToken = (payload: JWT): string => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, jwtSecret) as JwtPayload
    } catch (error) {
        return null;
    }
};
