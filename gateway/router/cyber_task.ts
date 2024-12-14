import express, { Router } from "express";

import { ping } from "../tools/net/ping/ping";
import { whois } from "../tools/net/whois/whois";
import { Nmap } from "../tools/net/Nmap/Nmap";

const router: Router = express.Router();

router.post('/net/Nmap/scan', Nmap as any);

router.post('/net/whois/scan', whois as any);

router.post('/net/ping/scan', ping as any);

export default router