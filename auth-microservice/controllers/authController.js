const jwtService = require('../services/jwtService');
const permissionService = require('../services/permissionService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { Languages } = require('../utils/Languag.json')

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password);
    if (!user) {
        return res.status(404).json({ message: 'Incorrect login or password' });
    }
    const token = jwtService.signToken({ id: user.id, permissions: user.permissions });
    db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, user.id], (err) => {
        if (err) {
            console.error(err);
        }
    })
    res.status(201).json({
        message: "Please keep it with you for safety",
        token: token,
        id: user.id
     });
};

exports.verifyAccess = async (req, res) => {
    const { token, path } = req.body;
    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Token is invalid' });
    }

    db.get('SELECT id, token FROM users WHERE id = ? AND token = ?', [decoded.id, token], async (err, row) => {
        if (err) {
            console.error(err)
            return res.status(402).json({ message: 'Token is invalid' });
        } else if (row) {
            const hasAccess = await permissionService.checkPermission(decoded.permissions, path);
            if (!hasAccess) {
                return res.status(403).json({ message: 'Access Denied' });
            }
            res.status(200).json({ message: 'Access granted', id: decoded.id });

        } else { return res.status(402).json({ message: "Token is invalid" }); }
    })

    // if (true) {
    //     const hasAccess = await permissionService.checkPermission(decoded.permissions, path);
    //     if (!hasAccess) {
    //         return res.status(403).json({ message: 'Доступ запрещен' });
    //     }
    //     res.json({ message: 'Доступ разрешен' });
    // } else res.status(401).json({ message: 'Токен недействителен' });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, Language } = req.body;
    

        const existingUser = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(401).json({ message: 'A user with that name or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create(username, email, hashedPassword, Language);

        const token = jwtService.signToken(newUser);
        db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, newUser.id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'ERROR SERVER' });
            }
        })
        res.status(201).json({
            message: "Please keep it with you for safety",
            token: token,
            id: newUser.id
        });
    } catch {
        res.status(400).json({
            message: "error while requesting"
        });
    }
};
