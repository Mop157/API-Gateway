import axios from "axios";
import { Request, Response } from "express";

import { URL_auth } from "../config.json"
import Languages from "../utils/Languages";
import { Validator, ValidationError } from "../validators/validators";

export interface authUser_res {
    message: string
    id?: number
    token?: string
}

export interface authUser_error {
    error: authUser_res | string
    status: number
}

interface newRequest extends Request {
    headers: any;
    body: reqUser
}

interface reqUser {
    username?: string
    email?: string
    password?: string
}

const Language_all: string[] = [
    "UA", "RU", "EN",
]

export const authUser = async (token: string, pole: string, Language: string): Promise<authUser_res | authUser_error> => {
    try {
        const row = await axios.post<authUser_res>(URL_auth + '/auth/verifyAccess', {
            token: token,
            path: pole,
            Language: Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        return row.data
    } catch (error: any) {
        if (error.response) {
            throw {
                error: error.response.data,
                status: error.status || 500
            } as authUser_error
        } else { 
            console.error('помилка запроса:', error.request);
            throw {
                error: Languages['the server is not responding'][Language],
                status: error.status || 500
            } as authUser_error
        }
    }
}

export const loginUser = async (req: newRequest, res: Response): Promise<void> => {
    let Language: string = await Validator.Languageerror(req.headers['accept-language']) ? req.headers['accept-language'] : "EN" 
    try {
        const { username, password }: reqUser = req.body

        if (!username || !password) throw new ValidationError(404, "Incorrect data in the request")

        await Validator.usernloginerror(username, password)

        const row = await axios.post<authUser_res>(URL_auth + '/auth/login', {
            username: username,
            password: password,
            Language: Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        res.status(row.status).json(row.data)
        return
    } catch (error: any) {
        if (error?.status) {
            if (error.response) {
                res.status(error.status).json({ error: error.response.data })
                return
            }
            console.log(error.message, error.status)
            res.status(error.status).json({ error: Languages[error.message][Language]})
            return

        } else { 
            console.error('помилка запроса:', error.request);
            res.status(error.status || 500).json({ error: Languages['the server is not responding'][Language] })
            return
        }
    }
}

export const registUser = async (req: newRequest, res: Response): Promise<void> => {
    let Language: string = await Validator.Languageerror(req.headers['accept-language']) ? req.headers['accept-language'] : "EN" 
    try {
        const { username, email, password }: reqUser = req.body

        if (!username || !password || !email) throw new ValidationError(404, "Incorrect data in the request")

        await Promise.all([
            Validator.usernloginerror(username, password, email),
            Validator.passworderror(password),
            Validator.emailerror(email),
            Validator.usernamelengtherror(username)
        ])

        const row = await axios.post<authUser_res>(URL_auth + '/auth/register', {
            username: username,
            password: password,
            email: email,
            Language: Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        res.status(row.status).json(row.data)

    } catch (error: any) {

        if (error?.status) {
            if (error.response) {
                res.status(error.status).json({ error: error.response.data })
                return
            }
            res.status(error.status).json({ error: Languages[error.message][Language]})
            return

        } else { 
            console.error('помилка запроса:', error.request);
            res.status(error.status || 500).json({ error: Languages['the server is not responding'][Language] })
            return
        }
    }
}