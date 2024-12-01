// const axios = require('axios');
// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
const auth = require('../auth_user/auth')
// const Promise = require('bluebird')
const { rateLimiter } = require('../Limite_post/limite');
const Languages = require('../utils/Languag.json')

const Language_all = [
    "UA", "RU", "EN",
]

exports.AUTH = ((req, res, next) => {
    const token = req.headers['authorization'];
    let Language = !Language_all.includes(req.headers['accept-language']) ? "EN" : req.headers['accept-language']

    if (!token) return res.status(401).json({ message: Languages['Token not provided'][Language] })

    auth.authUser(token, "USER", Language)
    .then(res => rateLimiter(res.id, Language))
    .then(final => {
        if (final) {
            req.Language = Language
            next()
        }
    })
    .catch(err => res.status(err.status).json({ error: err.error}))
    
})