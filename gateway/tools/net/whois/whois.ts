import { Request, Response } from "express";

import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';
import { microserverRequest } from "../../../utils/axios_POST";
import { Validator, ValidationError } from '../../../validators/validators';

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

// interface whois_Error extends Error {
//     code: string
//     message: string
//     response: whois_res | undefined;
// }


export const whois = async (req: newRequest, res: Response): Promise<void> => {
    const Language = req.Language
    try {
        let target: string | undefined = req?.body?.target

        if (!target) throw new ValidationError(404, "Incorrect data in the request")
            
        await Promise.all([
            Validator.html(target),
            Validator.ipdomainerror(target)
                ])

        const row = await microserverRequest<whois_res>(
                URL_cyber + "/api/net/whois/scan",
                {
                    domain: target,
                    Language: Language
                }
            ) as whois_res
    
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