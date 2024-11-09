const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    
    static async findByUsernameOrEmail(username, email) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async create(username, email, password, Language) {
        return new Promise((resolve, reject) => {
            const permissions = 'USER'; 
            db.run("INSERT INTO users (username, email, password, permissions, Language, TOKEN) VALUES (?, ?, ?, ?, ?)", 
                [username, email, password, permissions, Language, null], 
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, permissions: permissions, Language: Language });
                });
        });
    }

    static async findByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
                if (err) return reject(err);
                if (!user) return resolve(null);

                const isMatch = await bcrypt.compare(password, user.password);
                return isMatch ? resolve(user) : resolve(null);
            });
        });
    }
}

module.exports = User;
