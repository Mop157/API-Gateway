const axios = require('axios');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const { datasave } = require('../../../mongo/database')
const { URL_cyber } = require('../../../config.json');
const Languages = require('../../../utils/Languag.json')
const { allowedArguments, scripts} = require('./scripts.json')

exports.Nmap = async (req, res) => {

    let ip = req.body?.ip ?? null
    const setting_port = req.body?.setting?.list_port ?? ""
    const setting_arguments = req.body?.setting?.arguments ?? []
    const script = req.body?.script ?? ""
    const Language = req.Language

    if (!(validator.isIP(ip) || validator.isFQDN(ip))) {
        res.status(400).json({ error: Languages["Invalid IP address or domain"][Language]});
        return;
    }

    const ports = setting_port.split(',');
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

    ip = sanitizeHtml(ip);

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
            response: err.response ? err.response.status : "Нет ответа"
        })
         .catch(err => console.error(err))
        console.error(err)
        res.status(500).json({ error: Languages["error: microserver not responding"][Language]})
    })
}