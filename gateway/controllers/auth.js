const axios = require('axios');
const Promise = require('bluebird')
// const Languages = require('../utils/Languag.json')
const { URL_auth } = require('../config.json')



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
            return Promise.reject({
                error: error.response.data,
                status: error.status || 500
            })
        } else if (error.request) { 
            console.error('Ошибка запроса:', error.request);
            return Promise.reject({
                error: "сервер не отвечает",
                status: error.status || 500
            })
        } else {
            console.error('Ошибка:', error.message);
            return Promise.reject({
                error: "сервер не отвечает",
                status: error.status || 500
            })
        }
    }
}