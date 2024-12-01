const axios = require('axios');
// const Promise = require('bluebird')
// const Languages = require('../utils/Languag.json')
const { URL_auth } = require('../config.json')
const Languages = require('../utils/Languag.json')

const Language_all = [
    "UA", "RU", "EN",
]

exports.authUser = async (token, pole, Language) => {
    try {
        const row = await axios.post(URL_auth + '/auth/verifyAccess', {
            "token": token,
            "path": pole,
            "Language": Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        return row.data
    } catch (error) {
        if (error.response) {
            throw {
                error: error.response.data,
                status: error.status || 500
            }
        } else { 
            console.error('Ошибка запроса:', error.request);
            throw {
                error: Languages['the server is not responding'][Language],
                status: error.status || 500
            }
        }
    }
}

exports.loginUser = async (req, res) => {
    let Language = !Language_all.includes(req.headers['accept-language']) ? "EN" : req.headers['accept-language']
    try {
        const { username, password } = req.body

        if (!username || !password) return res.status(400).json({
            error: Languages["Incorrect data in the request"][Language]
        })

        const row = await axios.post(URL_auth + '/auth/login', {
            username: username,
            password: password,
            Language: Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        return row.data
    } catch (error) {
        if (error.response) {
            return res.status(error.status || 500).json({ error: error.response.data })
        } else { 
            console.error('Ошибка запроса:', error.request);
            return res.status(error.status || 500).json({ error: Languages['the server is not responding'][Language] })
        }
    }
}

exports.registUser = async (req, res) => {
    let Language = !Language_all.includes(req.headers['accept-language']) ? "EN" : req.headers['accept-language']
    try {
        const { username, email, password } = req.body

        if (!username || !password || !email) return res.status(400).json({
            error: Languages["Incorrect data in the request"][Language]
        })

        const test_password = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
        if (!test_password) return res.status(400).json({
            error: Languages['(Minimum 8 characters, at least one number, one uppercase and one lowercase letter)'][Language]
        })

        const test_email = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)
        if (!test_email) return res.status(400).json({
            error: Languages['Incorrect mail'][Language]
        })

        if (username.length < 4) return res.status(400).json({
            error: Languages['The nickname is too small'][Language]
        })

        const row = await axios.post(URL_auth + '/auth/register', {
            username: username,
            password: password,
            email: email,
            Language: Language
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        return row.data
    } catch (error) {
        if (error.response) {
            return res.status(error.status || 500).json({ error: error.response.data })
        } else { 
            console.error('Ошибка запроса:', error.request);
            return res.status(error.status || 500).json({ error: Languages['the server is not responding'][Language] })
        }
    }
}