const { redis } = require('../index')
const Promise = require('bluebird')

exports.rateLimiter = async (id) => {
    return new Promise(async (resplve, reject) => {
        
        if (!id) {
            reject({ error: 'user not found', status: 404 });
        }

        const requestsKey = `rate_limit_${id}`;
        const limit = 2; // Максимальное количество запросов за 7 дней
        const timeWindow = 7 * 24 * 60 * 60; // 7 дней в секундах

        try {
            // Получаем текущее количество запросов из Redis
            const currentRequests = await redis.get(requestsKey);

            if (currentRequests && currentRequests >= limit) {
                reject({ error: 'You have reached your 7 day request limit.', status: 429 });
            }

            // Увеличиваем счетчик запросов, если он уже существует; в противном случае создаем новый с истечением срока
            await redis.multi()
                .incr(requestsKey) // Увеличивает счетчик на 1
                .expire(requestsKey, timeWindow) // Устанавливает срок истечения в 7 дней
                .exec();

            resplve(true) // Продолжаем обработку запроса
        } catch (error) {
            console.error('Ошибка лимита запросов:', error);
            reject({ error: 'Server error checking request limit.', status: 500 });
        }
    })
};
