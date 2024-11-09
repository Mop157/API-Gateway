const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.signToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        return null;
    }
};
