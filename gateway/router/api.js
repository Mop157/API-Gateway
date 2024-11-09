const express = require('express');
const axios = require('axios');
const router = express.Router();
const { AYDIT } = require('../config.json')

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Aydit_db = new sqlite3.Database(path.join(__dirname, '../SQL/aydit.db'));

Aydit_db.run(`CREATE TABLE IF NOT EXISTS objects (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, data TEXT)`); // const timestamp = new Date().toISOString();

router.post('/translate', (req, res) => {
    const { text, translat } = req.body
    const time = new Date().toISOString()

    let translate = ''
    let aydit;

    if (translat) {
        translate += 'ru|en'
    } else {
        translate += 'en|ru'
    }
    
    axios.get(`https://api.mymemory.translated.net/get?q=${text}&langpair=${translate}`)
     .then(response => {
        aydit = {
            time: time,
            send: "/translate - перевод текста",
            post: text,
            translate: translate,
            received: response.data.responseData.translatedText,
            error: false
        }
        res.status(202).json(response.data.responseData.translatedText);
    })
     .catch(error => {
        aydit = {
            time: time,
            send: "/translate - перевод текста",
            post: text,
            translate: translate,
            received: 'ОШИБКА',
            error: error
        }
        console.error('Error:', error);
    });

    const jsonString = JSON.stringify(aydit);

    Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
        if (err) throw err
        if (AYDIT) {
            console.log(`зашел на главную страницу`);
        }
    });
});

router.post('/AI', async (req, res) => {

    const { text } = req.body
    const time = new Date().toISOString()
    
    const apis = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDCNnMbnlWDXmVWWT7XUGUNiBpfW7eP3C8', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "contents":[
                {
                    "parts":[
                        {
                            "text": text
                        }
                    ]
                }
            ]
        })
    })

    const ress = await apis.json()

    const aydit = {
        time: time,
        send: "/ai - чат с ИИ гемини",
        post: text,
        received: ress.candidates[0].content.parts[0].text,
        error: false
    }

    const jsonString = JSON.stringify(aydit);

    Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
        if (err) throw err
        if (AYDIT) {
            console.log(`отправил сообщение для ИИ`);
        }
    });


    res.status(202).json(ress);
});

module.exports = router