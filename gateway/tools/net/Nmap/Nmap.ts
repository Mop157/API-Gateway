import axios from 'axios';
import { Request, Response } from "express";

import { datasave } from '../../../mongo/database';
import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';
import { arg } from './scripts';
import { html, ipdomainerror, ValidationError, portserror,
    duplicateportserror, isArrayerrorerror, in_argumentserror,
    duplicateargumenterror } from '../../../validators/validators';

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

interface data_script {
    ip: string
    range: string
    script: string
    Language: string
}

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

        if (!ip) throw new ValidationError(400, "Invalid IP address or domain")

        else if (!script) {
            const ports = list_port.split(',');

            await Promise.all([
                html(ip),
                ipdomainerror(ip),
                portserror(ports),
                duplicateportserror(ports),
                isArrayerrorerror(argument),
                in_argumentserror(argument),
                duplicateargumenterror(argument)
            ])

            request({
                ip,
                range: ports.join(","),
                script: argument.join(" "),
                Language: Language
            })
            return

        } else {

            await Promise.all([
                    html(ip),
                    ipdomainerror(ip)
                ])

            if (arg.scripts.hasOwnProperty(script)) {
                request({
                    ip,
                    range: arg.scripts[script].port,
                    script: arg.scripts[script].arguments,
                    Language: Language
                    })
                return
                } else throw new ValidationError(400, "Script does not exist. Please enter a valid script.")
            }

        function request(data: data_script): void {
            axios.post<Nmap_res>(URL_cyber + "/api/net/Nmap/scan", data, { headers: { 'Content-Type': 'application/json' } } )
            .then(ress => {
                datasave(req.body, ress.data)
                .catch(err => console.error(err))
                res.status(ress.data.status.status).json(ress.data)
            })
            .catch(err => {
                datasave(req.body, {
                    code: err.code,
                    message: err.message,
                    response: err.response ? err.response.status : "Нет нічего)"
                })
                .catch(err => console.error(err))
                console.error(err)
                res.status(500).json({ error: Languages["error: microserver not responding"][Language]})
            })
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