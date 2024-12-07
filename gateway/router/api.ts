const express = require('express');
const axios = require('axios');
const router = express.Router();
const datasave = require('../mongo/database')
const config = require('../config.json')

router.post('/translate', (req, res) => {
    const { text, translat } = req.body

    let translate = ''
    let user;
    let server;

    if (translat) {
        translate += 'ru|en'
    } else {
        translate += 'en|ru'
    }
    
    axios.get(`https://api.mymemory.translated.net/get?q=${text}&langpair=${translate}`)
     .then(response => {
        user = {
            send: "/translate - перевод слова",
            post: text,
            translate: translate,
            error: false
        }
        server = response.data.responseData.translatedText
        res.status(202).json(response.data.responseData.translatedText);
    })
     .catch(error => {
        user = {
            send: "/translate - перевод слова",
            post: text,
            translate: translate,
            error: error
        }
        server = 'ПОМИЛКА'
        console.error('Error:', error);
    })
     .finally(() => datasave(user, server))
     .catch(err => console.error(err))

});

router.post('/AI', async (req, res) => {

    const { text } = req.body
    
    
    const apis = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${config['API-KEY-AI']}`, {
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

    const server = ress.candidates[0].content.parts[0].text
    const user= {
        send: "/ai - чат с ІІ геміні",
        post: text,
        error: false
    }
    datasave(user, server)
     .catch(err => console.error(err))

    res.status(202).json(ress)

});

module.exports = router