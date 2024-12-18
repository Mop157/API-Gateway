import fs from "fs";

import { BACKUP_FILE } from "../../config.json";
import redis from "../limite";

interface datauser {
    [key: string]: {
        value: number,
        ttl: number
    }
}

export const backupRedisData = async (): Promise<void> => {
    const keys: string[] = await redis.keys('*');
    const data: datauser = {};

    for (const key of keys) {
        const value: number = Number(await redis.get(key)) || 0
        const ttl: number = await redis.ttl(key);
        data[key] = { value, ttl };
    }

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Дані Redis успішно збережені в backup_limite.json');
};

export const restoreRedisData = (): void => {
    if (fs.existsSync(BACKUP_FILE)) {
        const data = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));

        for (const key in data) {
            const { value, ttl }: {value: string, ttl: number} = data[key];
            redis.set(key, value);
            if (ttl > 0) {
                redis.expire(key, ttl);
            }
        }
        console.log('Дані Redis успішно відновлені з backup_limite.json');
    } else {
        console.log('Файл резервного копіювання не знайдено.');
    }
};