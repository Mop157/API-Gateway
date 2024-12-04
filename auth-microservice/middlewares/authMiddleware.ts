const jwtService = require('../services/jwtService');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Токен не надано' });
    }
    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Неправильний токен' });
    }
    req.user = decoded;
    next();
};
