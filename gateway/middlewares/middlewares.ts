import { NextFunction, Response, Request } from "express";

import { authUser, authUser_res, authUser_error } from "../auth_user/auth";
import { rateLimiter } from "../Limite_post/limite";
import Languages, {Language_all} from "../utils/Languages";

interface newRequest extends Request {
    Language?: string
}

export const AUTH = ((req: newRequest, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization'];
    const headers: string = req.headers['accept-language'] ?? "EN"
    let Language: string = !Language_all.includes(headers) ? "EN" : headers

    if (!token) {
        res.status(401).json({ 
            message: Languages['Token not provided'][Language]
        })
        return
    }

    authUser(token, "USER", Language)
    .then(ress => rateLimiter((ress as authUser_res).id, Language))
    .then(final => {
        if (final) {
            req.Language = Language
            next()
        }
    })
    .catch((err: authUser_error) => res.status(err.status).json({ error: err.error}))
})