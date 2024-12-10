import axios from 'axios';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import { Request, Response } from "express";

import { datasave } from '../../../mongo/database';
import { URL_cyber } from '../../../config.json';
import Languages from '../../../utils/Languages';
import { allowedArguments, scripts } from './scripts.json';

interface newRequest extends Request {
    Language: string
}

interface Nmap_req {
    ip?: string | null
    setting?: {
        list_port?: string
        arguments?: string[] | []
    }
    script?: string
}

export const Nmap = async (req: newRequest, res: Response) => {

    const {
        ip = null,
        setting: {
            list_port = "",
            arguments = []
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
    const isValidPorts = ports.every(port => /^\d+$/.test(port) && port >= 0 && port <= 65535);
    if (!isValidPorts) {
        if (!script) return res.status(400).json({ error: Languages["Incorrect port list"][Language] });
    }

    if (!Array.isArray(setting_arguments)) {
        return res.status(400).json({ error: Languages['Arguments must be an array.'][Language] });
    }

    const isValidArguments = setting_arguments.every(arg => allowedArguments.includes(arg));
    if (!isValidArguments) {
        if (!script) return res.status(400).json({ error: Languages['Incorrect arguments'][Language] });
    }

    const sanitizedArguments = setting_arguments.map(arg => sanitizeHtml(arg));

    // ip = sanitizeHtml(ip);

    let data;

    if (!!script) {
        if (scripts.hasOwnProperty(script)) {
            data = {
                ip,
                range: scripts[script].port,
                script: scripts[script].arguments,
                Language: Language
            }
        } else data = { ip, range: ports.join(","), script: sanitizedArguments.join(" "), Language: Language }
    } else data = { ip, range: ports.join(","), script: sanitizedArguments.join(" "), Language: Language }

    axios.post(URL_cyber + "/api/net/Nmap/scan", data, { headers: { 'Content-Type': 'application/json' } } )
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