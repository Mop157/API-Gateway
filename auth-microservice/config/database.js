const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./config/database.db');

// const hashedPassword = bcrypt.hashSync('password', 10);

// Создание таблицы пользователей
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            permissions TEXT,
            Language TEXT,
            TOKEN TEXT
        )
    `);
    // Добавляем тестового пользователя
    // db.run(`
    //     INSERT INTO users (username, password, permissions) VALUES
    //     ('testUser1', '$2a$10$WIFGPAuCHfLpJemuKkFXe.wseUtUQ5WIl6LFMQhihlcySai9gkxDy', '["/api/cyber_task"]')
    // `);  // пароль 'password' после bcrypt-хеширования
});

module.exports = db;
