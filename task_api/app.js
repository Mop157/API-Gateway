const express = require('express');
const app = express();
const PORT = 4100;
const tasksR = require('./router/tasks')

app.use(express.json());
app.use("/task", tasksR)

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
