const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    
    static async findByUsernameOrEmail(username, email) {
        db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, row) => {
            if (err) throw err
            return row
        });
    }

    static async create(username, email, password, Language) {
        const permissions = 'USER'; 
        db.run("INSERT INTO users (username, email, password, permissions, Language, TOKEN) VALUES (?, ?, ?, ?, ?)", 
            [username, email, password, permissions, Language, null], 
            (err) => {
                if (err) throw err;
                return { id: this.lastID, permissions: permissions, Language: Language }
            });
    }

    static async findByCredentials(username, password) {
        db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
            if (err) throw err
            if (!user) return null

            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch ? user : null
        });
    }
}

module.exports = User;
