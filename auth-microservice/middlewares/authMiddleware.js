const jwtService = require('../services/jwtService');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Неверный токен' });
    }
    req.user = decoded;
    next();
};
