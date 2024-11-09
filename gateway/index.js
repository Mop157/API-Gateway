const cluster = require('cluster');
const os = require('os');
const express = require('express');
const tasksR = require('./router/tasks')
const apiR = require('./router/api')
const cyberR = require('./router/cyber_task')
const { clasters } = require('./config.json')
const middleware = require('./middlewares/middlewares')
let redis;

if (cluster.isMaster) {
    const Redis = require('ioredis');
    redis = new Redis();

    const numCPUs = 2; 
    console.log(`Запуск кластера с ${numCPUs} воркерами...`);

    function newWorker() {
        const worker = cluster.fork();

        worker.on('exit', (code, signal) => {
            console.error(`Worker ${worker.process.pid} exited with code ${code} (signal: ${signal})`);

        });

        // Слушаем сообщения от воркеров
        worker.on('message', (msg) => {
            if (msg.type === 'status') {
                console.log(`Worker ${worker.process.pid} status:`, msg.data);
            }
        });
    }

    for (let i = 0; i < numCPUs; i++) {
        newWorker()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Воркер ${worker.process.pid} завершился. Создаю новый...`);
        newWorker()
    });

} else {
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use("/api/task", middleware.AUTH, tasksR)
    app.use('/api', apiR)
    app.use('/api/cuber',cyberR)

    if (clasters) setInterval(() => {
        console.log({
            type: 'status',
            data: { memoryUsage: process.memoryUsage(), uptime: process.uptime() }
        })
    }, 30000);

    app.listen(PORT, () => {
        console.log(`запущен воркером ${process.pid} на порту ${PORT}`);
    });
}

module.exports = redis
