const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Promise = require('bluebird')
const Languages = require('../utils/Languag.json')

const { AYDIT, URL_auth } = require('../config.json');
const Aydit_db = new sqlite3.Database(path.join(__dirname, '../SQL/aydit.db'));

Aydit_db.run(`CREATE TABLE IF NOT EXISTS objects (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, data TEXT)`); // const timestamp = new Date().toISOString();


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
        
        return Promise.resolve(row.data)
    } catch (error) {
        if (error.response) {
            return Promise.reject({
                error: error.response.data,
                status: error.status
            })
        } else if (error.request) { 
            console.error('Ошибка запроса:', error.request);
            return Promise.reject({
                error: null,
                status: error.status
            })
        } else {
            console.error('Ошибка:', error.message);
            return Promise.reject({
                error: null,
                status: error.status
            })
        }
    }
}