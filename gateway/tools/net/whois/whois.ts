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

export const whois = async (req: newRequest, res: Response): Promise<void> => {

    let domain: string | undefined = req.body.domain
    const Language = req.Language

    if (!domain) {
        res.status(400).json({ error: Languages['Incorrect data in the request'][Language]});
        return

    } else if (!validator.isFQDN(domain)) {
        res.status(400).json({ error: Languages['Invalid domain'][Language]});
        return

    }

    // domain = sanitizeHtml(domain);

    axios.post<any>(URL_cyber + "/api/net/whois/scan", {
        domain: domain,
        Language: Language
    }, { headers: { 'Content-Type': 'application/json' } } )
    .then((ress: any) => {
        datasave(req.body, ress.data)
         .catch(err => console.error(err))
        res.status(ress.data.status.status).json(ress.data)
    })
    .catch(err => {
        datasave(req.body, {
            code: err.code,
            message: err.message,
            response: err.response ? err.response.status : "Нет ответа"
        })
         .catch(err => console.error(err))
        console.error(err)
        res.status(500).json({ error: Languages["error: microserver not responding"][Language]})
    })
}