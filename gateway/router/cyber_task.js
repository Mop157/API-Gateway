const express = require('express');
const axios = require('axios');

const router = express.Router();
const { URL_cyber } = require('../config.json');
// const auth = require('../controllers/auth')

router.post('/net/Nmap/scan', async (req, res) => {

    axios.post(URL_cyber + "/api/net/Nmap/scan", {}, { headers: { 'Content-Type': 'application/json' } } )

    res.status(200).json("hello");
});

router.post('/net/whois/scan', async (req, res) => {

    axios.post(URL_cyber + "/api/net/whois/scan", {}, { headers: { 'Content-Type': 'application/json' } } )

    res.status(200).json("hello");
});

router.post('/net/ping/scan', async (req, res) => {

    axios.post(URL_cyber + "/api/net/ping/scan", {}, { headers: { 'Content-Type': 'application/json' } } )

    res.status(200).json("hello");
});

module.exports = router