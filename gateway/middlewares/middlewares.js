const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const auth = require('../controllers/auth')
const Promise = require('bluebird')
const { rateLimiter } = require('../Limite_post/limite');


exports.AUTH = ((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    auth.authUser(token, "USER")
    .then(res => rateLimiter(res.id))
    .then(final => {
        console.log(final)
        if (final) {
            next()
        }
    })
    .catch(err => res.status(err.status).json(err.error))
    
})

exports.CTLO = ((req, res, next) => {
    console.log(req.token)
    next();
})