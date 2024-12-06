const cluster = require('cluster');
// const os = require('os');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');

const { PORT, server } = require('./config.json')
// const tasksR = require('./router/tasks')
const apiR = require('./router/api')
const cyberR = require('./router/cyber_task')
const authUser = require('./router/login')
const middleware = require('./middlewares/middlewares')
const { restoreRedisData} = require('./Limite_post/backup/backupLimit') //  backupRedisData, 
const { errorHandler } = require('./middlewares/errorHandler')

const options = {
    key: fs.readFileSync('./certificat/private.key'),
    cert: fs.readFileSync('./certificat/certificate.crt')
};

if (cluster.isMaster) {

    restoreRedisData()

    // setInterval(backupRedisData, 100000);

    const numCPUs = 2; 
    console.log(`Запуск кластера с ${numCPUs} воркерами...`);

    function newWorker() {
        const worker = cluster.fork();

        worker.on('exit', (code, signal) => {
            console.error(`Worker ${worker.process.pid} exited with code ${code} (signal: ${signal})`);

        });

        worker.on('message', (msg) => {
            if (msg.type === 'status') {
                console.log(`Worker ${worker.process.pid} status:`, msg.data);
            }
        });
    }

    for (let i = 0; i < numCPUs; i++) {
        newWorker()
    }

    cluster.on('exit', (worker) => {
        console.log(`Воркер ${worker.process.pid} завершился. Создаю новый...`);
        newWorker()
    });

} else {
    const app = express();

    app.use(express.json());
    app.use(compression())
    app.use(helmet())
    // app.use("/api/task", middleware.AUTH, tasksR)
    app.use('/api', apiR)
    app.use('/api', middleware.AUTH, cyberR)
    app.use('/api', authUser)
    app.use(errorHandler)

    

    if (server) {
        app.listen(PORT, () => {
            console.log(`запущений воркером ${process.pid} на порту ${PORT}`);
        });
    } else {
        https.createServer(options, app).listen(443, () => {
            console.log('HTTPS сервер запущений на порту 443');
        });
    }
}
