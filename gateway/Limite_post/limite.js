const Redis = require('ioredis');
const redis = new Redis();
// const Promise = require('bluebird')
const Languages = require('../utils/Languag.json')

exports.rateLimiter = async (id, Language) => {
    if (!id) {
        throw { error: Languages['user not found'][Language], status: 404 };
    }

    const requestsKey = `rate_limit_${id}`;
    const limit = 300; //  7 днів
    const timeWindow = 7 * 24 * 60 * 60; // 7 днів в секундах

    try {
        const currentRequests = await redis.get(requestsKey);

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
    } catch (error) {
        console.error('Помилка ліміту запитів:', error);
        throw { error: Languages['Server error checking request limit.'][Language], status: 500 };
    }
};

exports.redis = redis
