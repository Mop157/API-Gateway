import { Request, Response } from "express";

import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';
import { microserverRequest } from "../../../utils/axios_POST";
import { arg } from './scripts';
import { Validator, ValidationError } from '../../../validators/validators';

interface newRequest extends Request {
    Language: string
}

interface Nmap_res {
    data: {
      [key: string]: {
        hostname?: string,
        protocols?: {
            [key: string]: {
                [key: string]: {
                    cpe?: string
                    extrainfo?: string
                    product?: string
                    reason?: string
                    service?: string
                    state?: string
                    version?: string
                }
            }
        },
        state?: string
      }
    }
    message: string | null
    status: {
      message: string
      status: number
    }
}

interface Nmap_req {
    ip?: string | null
    setting?: {
        list_port?: string
        argument?: string[]
    }
    script?: string
}

// interface data_script {
//     ip: string
//     range: string
//     script: string
//     Language: string
// }

export const Nmap = async (req: newRequest, res: Response): Promise<void> => {
    const Language = req.Language
    try {
        const {
            ip = null,
            setting: {
                list_port = "",
                argument = []
            } = {},
            script = ""
        }: Nmap_req = req.body

        if (!ip) throw new ValidationError(404, "Invalid IP address or domain")

        else if (!script) {
            const ports = list_port.split(',');

            await Promise.all([
                Validator.html(ip),
                Validator.ipdomainerror(ip),
                Validator.portserror(ports),
                Validator.duplicateportserror(ports),
                Validator.isArrayerrorerror(argument),
                Validator.in_argumentserror(argument),
                Validator.duplicateargumenterror(argument)
            ])

            const row = await microserverRequest<Nmap_res>(
                URL_cyber + "/api/net/Nmap/scan",
                {
                    ip,
                    range: ports.join(","),
                    script: argument.join(" "),
                    Language: Language
                }
                ) as Nmap_res
                
            res.status(row.status.status).json(row)
            return

        } else {

            await Promise.all([
                Validator.html(ip),
                Validator.ipdomainerror(ip)
                ])

            if (arg.scripts.hasOwnProperty(script)) {
                const row = await microserverRequest<Nmap_res>(
                    URL_cyber + "/api/net/Nmap/scan",
                    {
                        ip,
                        range: arg.scripts[script].port,
                        script: arg.scripts[script].arguments,
                        Language: Language
                    }
                    ) as Nmap_res
                    
                res.status(row.status.status).json(row)
                return
                } else throw new ValidationError(400, "Script does not exist. Please enter a valid script.")
            }

    } catch (err: any) {
        if (err?.status) {
            res.status(err.status).json({ error: Languages[err.message][Language]})
        } else {
            console.error(err)
            res.status(500).json({ error: Languages["error: internal server error"][Language]})
        }
    }
}