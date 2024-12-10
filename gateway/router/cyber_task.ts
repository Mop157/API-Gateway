import express, { Router } from "express";

import { ping } from "../tools/net/ping/ping";
import { whois } from "../tools/net/whois/whois";
import {  } from "../tools/net/Nmap/Nmap";

const router: Router = express.Router();

router.post('/net/Nmap/scan', Nmap);

router.post('/net/whois/scan', whois);

router.post('/net/ping/scan', ping);

module.exports = router