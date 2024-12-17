import axios from 'axios';
import { Request, Response } from "express";

import { datasave } from '../../../mongo/database';
import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';
import { html, ipdomainerror, ValidationError } from '../../../validators/validators';

interface newRequest extends Request {
    Language: string
}

interface whois_res {
    data: {
        domain_name: string | null,
        registrar: string | null,
        registrar_url: string | null,
        reseller: string | null,
        referral_url: string | null,
        updated_date: string[] | null,
        creation_date: string[] | null,
        expiration_date: string[] | null,
        name_servers: string[] | null,
        status: string[] | null,
        emails: string[] | null,
        dnssec: string | null,
        name: string | null,
        org: string | null,
        address: string[] | null,
        city: string | null,
        state: string | null,
        registrant_postal_code: string | null,
        country: string | null
      }
    message: string | null
    status: {
        message: string
        status: number
    }
}

interface whois_Error extends Error {
    code: string
    message: string
    response: whois_res | undefined;
}


export const whois = async (req: newRequest, res: Response): Promise<void> => {
    const Language = req.Language
    try {
        let target: string | undefined = req?.body?.target

        if (!target) throw new ValidationError(400, "Incorrect data in the request")
            
        await Promise.all([
                    html(target),
                    ipdomainerror(target)
                ])

        axios.post<whois_res>(URL_cyber + "/api/net/whois/scan", {
            domain: target,
            Language: Language
        }, { headers: { 'Content-Type': 'application/json' } } )
        .then(ress => {
            datasave(req.body, ress.data)
            .catch(err => console.error(err))
            res.status(ress.data.status.status).json(ress.data)
        })
        .catch((err: whois_Error) => {
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