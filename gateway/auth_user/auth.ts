import axios from "axios";
import { Request, Response } from "express";

import { URL_auth } from "../config.json"
import Languages from "../utils/Languages";

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
    let Language: string = !Language_all.includes(req.headers['accept-language']) ? "EN" : req.headers['accept-language']
    try {
        const { username, password }: reqUser = req.body

        if (!username || !password) {
            res.status(400).json({
                error: Languages["Incorrect data in the request"][Language]
            })
            return
        }

        const row = await axios.post<authUser_res>(URL_auth + '/auth/login', {
            username: username,
            password: password,
            Language: Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        res.status(200).json(row.data)
        return
    } catch (error: any) {
        if (error.response) {
            res.status(error.status || 500).json({ error: error.response.data })
            return
        } else { 
            console.error('помилка запроса:', error.request);
            res.status(error.status || 500).json({ error: Languages['the server is not responding'][Language] })
            return
        }
    }
}

export const registUser = async (req: newRequest, res: Response): Promise<void> => {
    let Language: string = !Language_all.includes(req.headers['accept-language']) ? "EN" : req.headers['accept-language']
    try {
        const { username, email, password }: reqUser = req.body

        if (!username || !password || !email) {
            res.status(400).json({
                error: Languages["Incorrect data in the request"][Language]
            })
            return

        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            res.status(400).json({
                error: Languages['(Minimum 8 characters, at least one number, one uppercase and one lowercase letter)'][Language]
            })
            return

        } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
            res.status(400).json({
                error: Languages['Incorrect mail'][Language]
            })
            return

        } else if (username.length < 4) {
            res.status(400).json({
                error: Languages['The nickname is too small'][Language]
            })
            return
        }

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
        res.status(200).json(row.data)

    } catch (error: any) {

        if (error.response) {
            res.status(error.status || 500).json({ error: error.response.data })
            return

        } else { 
            console.error('помилка запроса:', error.request);
            res.status(error.status || 500).json({ error: Languages['the server is not responding'][Language] })
            return
        }
    }
}