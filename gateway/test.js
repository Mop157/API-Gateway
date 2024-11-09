const cluster = require('cluster');
const os = require('os');
`
Worker 19752 status: {
    memoryUsage: {
      rss: 27443200, память (27443200 = 27.4 МБ)
      heapTotal: 4939776, память (статическая) которую использует (4939776 = 4.9 МБ)
      heapUsed: 4340840, реальная память которая используеться ( = 4.3 МБ)
      external: 1593552, потребность памяти
      arrayBuffers: 10691 буфер масиива
    },
    uptime: 15.0528492 время работы
  }
`
if (cluster.isMaster) {
    // Определим количество воркеров по количеству ядер процессора
    const numCPUs = 2;

    console.log(`Master process ${process.pid} is running`);

    // Запускаем воркеры
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        // Следим за завершением работы воркера
        worker.on('exit', (code, signal) => {
            console.error(`Worker ${worker.process.pid} exited with code ${code} (signal: ${signal})`);
            // Перезапускаем воркер в случае ошибки
            if (code !== 0) {
                console.log(`Starting a new worker after failure`);
                cluster.fork();
            }
        });

        // Слушаем сообщения от воркеров
        worker.on('message', (msg) => {
            if (msg.type === 'status') {
                console.log(`Worker ${worker.process.pid} status:`, msg.data);
            }
        });
    }

    // Обрабатываем событие завершения всех воркеров
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Воркеры: симуляция процесса с периодическим уведомлением о состоянии
    setInterval(() => {
        // Отправляем сообщение мастеру с данными о состоянии воркера
        process.send({
            type: 'status',
            data: { memoryUsage: process.memoryUsage(), uptime: process.uptime() }
        });
    }, 5000); // Отправляем статус каждые 5 секунд

    (async () => {
        let x = 5
        let z = 10
        let c = x + z
    })()
}
