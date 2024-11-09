const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const { AYDIT, URL_cyber } = require('../config.json');
const auth = require('../controllers/auth')
const Aydit_db = new sqlite3.Database(path.join(__dirname, '../SQL/aydit.db'));

Aydit_db.run(`CREATE TABLE IF NOT EXISTS objects (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, data TEXT)`); // const timestamp = new Date().toISOString();

router.get('/', async (req, res) => {

    // const role

    res.status(200).json("hello");
});

module.exports = router