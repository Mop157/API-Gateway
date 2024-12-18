import { Request, Response } from "express";

import { URL_cyber } from "../../../config.json";
import Languages from "../../../utils/Languages";
import { microserverRequest } from "../../../utils/axios_POST";
import { Validator, ValidationError } from '../../../validators/validators';

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

export const ping = async (req: newRequest, res: Response): Promise<void> => {
    const Language = req.Language
    try {
        let { target, number }: ping_req = req.body

        if (!target || !number) throw new ValidationError(404, "Incorrect data in the request")

        await Promise.all([
            Validator.html(target),
            Validator.numbererror(number, 0, 10),
            Validator.ipdomainerror(target)
        ])

        const row = await microserverRequest<ping_res>(
            URL_cyber + "/api/net/ping/scan",
            {
                ip: target,
                number: number,
                Language: Language
            }
        ) as ping_res

        res.status(row.status.status).json(row)

    } catch (err: any) {
        if (err?.status) {
            res.status(err.status).json({ error: Languages[err.message][Language]})
        } else {
            console.error(err)
            res.status(500).json({ error: Languages["error: internal server error"][Language]})
        }
    }
}