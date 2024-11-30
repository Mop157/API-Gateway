const axios = require('axios');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const { datasave } = require('../../../mongo/database')
const { URL_cyber } = require('../../../config.json');
const Languages = require('../../../utils/Languag.json')

exports.ping = async (req, res) => {

    let { ip, number } = req.body
    const Language = req.Language

    if (!ip || !number) return res.status(400).json({ error: Languages['Incorrect data in the request'][Language]});

    number = Number(number);  
    if (!Number.isInteger(number) || number <= 0 || number >= 10) return res.status(400).json({ error: Languages['The number is not correct'][Language]});
        
    if (!(validator.isIP(ip) || validator.isFQDN(ip))) return res.status(400).json({ error: Languages["Invalid IP address or domain"][Language]});

    ip = sanitizeHtml(ip);
    number = sanitizeHtml(number);

    axios.post(URL_cyber + "/api/net/ping/scan", {
        ip: ip,
        number: number,
        Language: Language
    }, { headers: { 'Content-Type': 'application/json' } } )
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