const { BACKUP_FILE } = require('../../config.json')
const { redis } = require('../limite')
const fs = require('fs');

exports.backupRedisData = async () => {
    const keys = await redis.keys('*');
    const data = {};

    for (const key of keys) {
        const value = await redis.get(key);
        const ttl = await redis.ttl(key);
        data[key] = { value, ttl };
    }

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Данные Redis успешно сохранены в backup_limite.json');
};

exports.restoreRedisData = () => {
    if (fs.existsSync(BACKUP_FILE)) {
        const data = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));

        for (const key in data) {
            const { value, ttl } = data[key];
            redis.set(key, value);
            if (ttl > 0) {
                redis.expire(key, ttl);
            }
        }
        console.log('Данные Redis успешно восстановлены из backup_limite.json');
    } else {
        console.log('Файл резервного копирования не найден.');
    }
};