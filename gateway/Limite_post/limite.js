const Redis = require('ioredis');
const redis = new Redis();
const Promise = require('bluebird')
const Languages = require('../utils/Languag.json')

exports.rateLimiter = async (id, Language) => {
    return new Promise(async (resplve, reject) => {
        
        if (!id) return reject({ error: Languages['user not found'][Language], status: 404 })

        const requestsKey = `rate_limit_${id}`;
        const limit = 300; // количество запросов за 7 дней
        const timeWindow = 7 * 24 * 60 * 60; // 7 дней в секундах

        try {
            const currentRequests = await redis.get(requestsKey);

            if (currentRequests && currentRequests >= limit) {
                reject({ error: Languages['You have reached your 7 day request limit.'][Language], status: 429 });
            }

            await redis.multi()
                .incr(requestsKey) // +1
                .expire(requestsKey, timeWindow) //  7 дней
                .exec();

            resplve(true)
        } catch (error) {
            console.error('Ошибка лимита запросов:', error);
            reject({ error: Languages['Server error checking request limit.'][Language], status: 500 });
        }
    })
};

exports.redis = redis
