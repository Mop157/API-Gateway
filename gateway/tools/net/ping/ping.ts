// обязательный тест!


import axios from "axios";
import validator from "validator";
import sanitizeHtml from "sanitize-html";

import { datasave } from "../../../mongo/database";
import { URL_cyber } from "../../../config.json";
import Languages from "../../../utils/Languages";
import { Request, Response } from "express";

interface newRequest extends Request {
    Language: string
}

interface ping_req { 
    ip?: string
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
    response: ping_res
}

export const ping = async (req: newRequest, res: Response): Promise<void> => {

    let { ip, number }: ping_req = req.body
    const Language = req.Language

    if (!ip || !number || !sanitizeHtml(ip)) {
        res.status(400).json({ error: Languages['Incorrect data in the request'][Language]});
        return

    } else if (!Number.isInteger(Number(number)) || number <= 0 || number >= 10) {
        res.status(400).json({ error: Languages['The number is not correct'][Language]});
        return

    } else if (!(validator.isIP(ip) || validator.isFQDN(ip))) {
        res.status(400).json({ error: Languages["Invalid IP address or domain"][Language]});
        return
    }

    axios.post<ping_res>(URL_cyber + "/api/net/ping/scan", {
        ip: ip,
        number: number,
        Language: Language
    }, { headers: { 'Content-Type': 'application/json' } } )
     .then(ress => {
        datasave(req.body, ress.data)
         .catch(err => console.error(err))
        res.status(ress.data.status.status).json(ress.data)
    })
     .catch((err: ping_Error) => {
        datasave(req.body, {
            code: err.code,
            message: err.message,
            response: err.response ? err.response : "Нет ответа"
        })
         .catch(err => console.error(err))
        console.error(err)
        res.status(500).json({ error: Languages["error: microserver not responding"][Language]})
    })
}