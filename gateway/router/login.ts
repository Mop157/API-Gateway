const express = require('express');
const router = express.Router();

const { registUser, loginUser } = require('../auth_user/auth')

router.post('/regist', registUser);

router.post('/login', loginUser);

module.exports = router
