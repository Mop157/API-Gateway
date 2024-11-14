const jwtService = require('../services/jwtService');
const permissionService = require('../services/permissionService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const Languages = require('../utils/Languag.json')

exports.login = async (req, res) => {
    
    const { username, password, Language } = req.body;
    const user = await User.findByCredentials(username, password);
    if (!user) {
        return res.status(404).json({ message: Languages['Incorrect login or password'][Language] });
    }
    const token = jwtService.signToken({ id: user.id, permissions: user.permissions });
    db.run(`UPDATE users SET TOKEN = ? WHERE id = ?`, [token, user.id], (err) => {
        if (err) {
            console.error(err);
        }
    })
    res.status(201).json({
        message: Languages['token'][Language],
        token: token,
        id: user.id
     });
};

exports.verifyAccess = async (req, res) => {
    const { token, path, Language } = req.body;
    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: Languages['Token is invalid'][Language] });
    }

    db.get('SELECT id, token FROM users WHERE id = ? AND token = ?', [decoded.id, token], async (err, row) => {
        if (err) {
            console.error(err)
            return res.status(402).json({ message: Languages['Token is invalid'][Language] });
        } else if (row) {
            const hasAccess = await permissionService.checkPermission(decoded.permissions, path);
            if (!hasAccess) {
                return res.status(403).json({ message: Languages['Access Denied'][Language] });
            }
            res.status(200).json({ message: Languages['Access granted'][Language], id: decoded.id });

        } else { return res.status(402).json({ message: Languages["Token is invalid"][Language] }); }
    })
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, Language } = req.body;
    

        const existingUser = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(401).json({ message: Languages['The user already exists'][Language] });
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
            message: Languages["token"][Language],
            token: token,
            id: newUser.id
        });
    } catch {
        res.status(400).json({
            message: Languages["error while requesting"][Language]
        });
    }
};
