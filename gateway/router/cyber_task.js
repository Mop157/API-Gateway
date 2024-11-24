const express = require('express');
const router = express.Router();
// const auth = require('../controllers/auth')

const { ping } = require('../tools/net/ping/ping')
const { whois } = require('../tools/net/whois/whois')
const { Nmap } = require('../tools/net/Nmap/Nmap')

router.post('/net/Nmap/scan', Nmap);

router.post('/net/whois/scan', whois);

router.post('/net/ping/scan', ping);

module.exports = router