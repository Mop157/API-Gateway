const axios = require('axios');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const { datasave } = require('../../../mongo/database')
const { URL_cyber } = require('../../../config.json');
const Languages = require('../../../utils/Languag.json')

exports.whois = async (req, res) => {

    let { domain } = req.body
    const Language = req.Language

    if (!domain) return res.status(400).json({ error: Languages['Incorrect data in the request'][Language]});

    if (!validator.isFQDN(domain)) {
        res.status(400).json({ error: Languages['Invalid domain'][Language]});
        return;
    }

    domain = sanitizeHtml(domain);

    axios.post(URL_cyber + "/api/net/whois/scan", {
        domain: domain,
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