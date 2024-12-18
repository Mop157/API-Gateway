import Redis from "ioredis";

import Languages from "../utils/Languages";

const redis: Redis = new Redis();

export const rateLimiter = async (id: number | undefined, Language: string): Promise<boolean> => {
    if (!id) {
        throw { error: Languages['user not found'][Language], status: 404 };
    }

    const requestsKey: string = `rate_limit_${id}`;
    const limit: number = 300; //  300 на 7 днів
    const timeWindow: number = 7 * 24 * 60 * 60; // 7 днів в секундах

    try {
        const currentRequests: number = Number(await redis.get(requestsKey)) || 0

        if (currentRequests && currentRequests >= limit) {
            throw { 
                error: Languages['You have reached your 7 day request limit.'][Language], 
                status: 429 
            };
        }

        await redis.multi()
            .incr(requestsKey) // +1
            .expire(requestsKey, timeWindow) // 7 днів
            .exec();

        return true;
    } catch (error: any) {
        console.error('Помилка ліміту запитів:', error);
        throw { error: Languages['Server error checking request limit.'][Language], status: 500 };
    }
};

export default redis
