import { NextFunction, Response, Request } from "express";
import { authUser } from "../auth_user/auth";
import { rateLimiter } from "../Limite_post/limite";
import Languages from "../utils/Languages";
import { addTransactionSupport } from "ioredis/built/transaction";
import DataHandler from "ioredis/built/DataHandler";
import { xDownloadOptions } from "helmet";

const Language_all: string[] = [
    "UA", "RU", "EN",
]

export const AUTH = ((req: Request, res: Response, next: NextFunction): void => {
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
    .then(ress => rateLimiter(ress.id, Language))
    .then(final => {
        if (final) {
            req.Language = Language
            next()
        }
    })
    .catch(err => res.status(err.status).json({ error: err.error}))
    
})
