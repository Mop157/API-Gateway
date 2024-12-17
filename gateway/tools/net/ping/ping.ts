import { Request, Response } from "express";
import axios from "axios";

import { datasave } from "../../../mongo/database";
import { URL_cyber } from "../../../config.json";
import Languages from "../../../utils/Languages";
import { html, numbererror, ipdomainerror, ValidationError } from '../../../validators/validators';

interface newRequest extends Request {
    Language: string
}

interface ping_req { 
    target?: string
    number?: number
}

interface ping_res {
    data: string | null
    message: string | null
    status: {
        message: string
        status: number
    }
}

interface ping_Error extends Error {
    code: string
    message: string
    response: ping_res | undefined;
}

export const ping = async (req: newRequest, res: Response): Promise<void> => {
    const Language = req.Language
    try {
        let { target, number }: ping_req = req.body

        if (!target || !number) throw new ValidationError(400, "Incorrect data in the request")

        await Promise.all([
            html(target),
            numbererror(number, 0, 10),
            ipdomainerror(target)
        ])
        // console.log(row)

        axios.post<ping_res>(URL_cyber + "/api/net/ping/scan", {
            ip: target,
            number: number,
            Language: Language
        }, { headers: { 'Content-Type': 'application/json' } } )
        .then(ress => {
            datasave(req.body, ress.data)
            .catch(err => console.error(err))
            res.status(ress.data.status.status).json(ress.data)
        })
        .catch((err: ping_Error) => {
            if (!err?.response) console.error(err)
            datasave(req.body, {
                code: err?.code,
                message: err?.message,
                response: err?.response ? err.response : "Нет ответа"
            })
            .catch(err => console.error(err))
            res.status(500).json({ error: Languages["error: microserver not responding"][Language]})
        })
        
    } catch (err: any) {
        if (err?.status) {
            res.status(err.status).json({ error: Languages[err.message][Language]})
        } else {
            console.error(err)
            res.status(500).json({ error: Languages["error: internal server error"][Language]})
        }
    }
}