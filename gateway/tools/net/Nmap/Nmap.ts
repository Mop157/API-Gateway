import axios from 'axios';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import { Request, Response } from "express";

import { datasave } from '../../../mongo/database';
import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';
import { arg } from './scripts';

interface newRequest extends Request {
    Language: string
}

interface Nmap_req {
    ip?: string | null
    setting?: {
        list_port?: string
        argument?: string[]
    }
    script?: string
}

export const Nmap = async (req: newRequest, res: Response): Promise<void> => {

    const {
        ip = null,
        setting: {
            list_port = "",
            argument = []
        } = {},
        script = ""
    }: Nmap_req = req.body
    const Language = req.Language

    if (!ip) {
        res.status(400).json({ error: Languages["Invalid IP address or domain"][Language]});
        return

    } else if (!(validator.isIP(ip) || validator.isFQDN(ip))) {
        res.status(400).json({ error: Languages["Invalid IP address or domain"][Language]});
        return
    }

    const ports = list_port.split(',');
    const isValidPorts = ports.every(port => /^\d+$/.test(port) && Number(port) >= 0 && Number(port) <= 65535);
    if (!isValidPorts) {
        if (!script) {
            res.status(400).json({ error: Languages["Incorrect port list"][Language] });
            return
        }

    } else if (!Array.isArray(argument)) {
        res.status(400).json({ error: Languages['Arguments must be an array.'][Language] });
        return

    } else if (!argument.every(args => arg.allowedArguments.includes(args))) {
        if (!script) {
            res.status(400).json({ error: Languages['Incorrect arguments'][Language] });
            return
        }
    }

    const sanitizedArguments = argument.map(arg => sanitizeHtml(arg));

    // ip = sanitizeHtml(ip);
    let data;

    if (!!script) {
        if (arg.scripts.hasOwnProperty(script)) {
            data = {
                ip,
                range: arg.scripts[script].port,
                script: arg.scripts[script].arguments,
                Language: Language
            }
        } else data = {
            ip,
            range: ports.join(","),
            script: sanitizedArguments.join(" "),
            Language: Language
        }
    } else data = {
        ip,
        range: ports.join(","),
        script: sanitizedArguments.join(" "),
        Language: Language
    }

    axios.post<any>(URL_cyber + "/api/net/Nmap/scan", data, { headers: { 'Content-Type': 'application/json' } } )
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
