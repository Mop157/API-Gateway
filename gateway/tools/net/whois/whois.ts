import axios from 'axios';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import { Request, Response } from "express";

import { datasave } from '../../../mongo/database';
import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';

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

    let domain: string | undefined = req?.body?.domain
    const Language = req.Language
    const html = (target: string): boolean => {
            if (sanitizeHtml(target) == target) return false
            else return true
            }

    if (!domain) {
        res.status(400).json({ error: Languages['Incorrect data in the request'][Language]});
        return

    } else if (!validator.isFQDN(domain) || html(domain)) {
        res.status(400).json({ error: Languages['Invalid domain'][Language]});
        return

    }

    axios.post<whois_res>(URL_cyber + "/api/net/whois/scan", {
        domain: domain,
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
}