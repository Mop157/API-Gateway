const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { AYDIT } = require('../config.json')

const db = new sqlite3.Database(path.join(__dirname, '../SQL/database.db'));
const Aydit_db = new sqlite3.Database(path.join(__dirname, '../SQL/aydit.db'));

db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, tisk_name TEXT, tisk_description TEXT, priority NUMBER)");
Aydit_db.run(`CREATE TABLE IF NOT EXISTS objects (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, data TEXT)`); // const timestamp = new Date().toISOString();

// Базовый маршрут для GET-запроса
// router.get('/', (req, res) => {
//     const time = new Date().toISOString()

//     const aydit = {
//         time: time,
//         send: "/ - зашел посмотреть главную страницу задач",
//         received: 'Добро пожаловать в наш API!',
//         error: false
//     }

//     const jsonString = JSON.stringify(aydit);

//     Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
//         if (err) throw err
//         if (AYDIT) {
//             console.log(`зашел на главную страницу`);
//         }
//     });

//     res.send('Добро пожаловать в наш API!');
// });



// let x = {
//     status: err ? "error" : "success" ,
//     message: err ? "Операція виконана успішно" : "Виникла помилка під час виконання операції.",
//     data: data,
//     error: err ? err : false
// }

router.get('/list', (req, res) => { // списки задач
    const time = new Date().toISOString()

    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            console.error(err)
        }

        const aydit = {
            time: time,
            send: "/list - для получения списка задач",
            received: rows,
            error: err ? err : false
        }

        const jsonString = JSON.stringify(aydit);

        Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
            if (err) throw err
            if (AYDIT) {
                console.log(`отримал список всех задач`);
            }
        });

        res.status(200).json({
            status: err ? "error" : "success" ,
            message: err ? "Операція виконана успішно" : "Виникла помилка під час виконання операції.",
            data: rows,
            error: err ? err : false
        });
    })
});

router.post('/open', (req, res) => {
    const { id, name } = req.body
    const updates = []
    const values = []
    const time = new Date().toISOString()

    if (id) {
        updates.push("id = ?");
        values.push(id);
    }
    if (name) {
        updates.push("tisk_name = ?");
        values.push(name);
    }

    const query = `SELECT * FROM tasks WHERE ${updates.join(" AND ")}`

    db.get(query, values, (err, row) => {
        if (err) {
            console.error(err)
        }
        
        const aydit = {
            time: time,
            send: "/open - для получения определеной задачи",
            post: values,
            received: row ? row : {
                id: "неправильный айди",
                tisk_name: undefined,
                tisk_description: undefined,
                priority: undefined
              },
            error: err ? err : false
        }

        const jsonString = JSON.stringify(aydit);

        Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
            if (err) throw err
            if (AYDIT) {
                console.log(`посмотрел задачу ${values}`);
            }
        });


        if (row) {
            res.status(200).json({
                status: err ? "error" : "success" ,
                message: err ?  "Виникла помилка під час виконання операції." : "Операція виконана успішно",
                data: row,
                error: err ? err : false
            });
        } else {
            res.status(401).json({
                status: err ? "error" : "no_data" ,
                message: err ? "Виникла помилка під час виконання операції." : "Дані не знайдено або відсутні.",
                data: {
                    id: id ?? null,
                    tisk_name: name ?? null,
                    tisk_description: null,
                    priority: null
                  },
                error: err ? err : false
            });
        }
    })

})

router.post('/add', (req, res) => { // добавление задачи
    try {
        const time = new Date().toISOString()
        const datas = req.body

        db.run("INSERT INTO tasks (tisk_name, tisk_description, priority) VALUES (?, ?, ?)", [datas.tisk_name, datas.tisk_description, datas.priority], (err) => {
            if (err) {
                console.error(err)
            }

            const aydit = {
                time: time,
                send: "/add - для создания задачи",
                post: datas,
                error: err ? err : false
            }

            const jsonString = JSON.stringify(aydit);

            Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
                if (err) throw err
                if (AYDIT) {
                    console.log(`добавил задачу ${datas.tisk_name}`);
                }
            });

            res.status(200).json({
                status: err ? "error" : "success" ,
                message: err ? "Виникла помилка під час виконання операції." : "Операція виконана успішно",
                data: datas.tisk_name,
                error: err ? err : false
            })
        });

    } catch (error) {
        res.status(401).json({
            status: err ? "error" : "no_data" ,
            message: err ? "Виникла помилка під час виконання операції." : "Дані не знайдено або відсутні.",
            data: null,
            error: err ? err : false
        });
    }
});

router.put('/up', (req, res) => {
    const { tisk_name, tisk_description, priority, id } = req.body;
    const time = new Date().toISOString()

    const updates = [];
    const values = [];

    if (tisk_name) {
        updates.push("tisk_name = ?");
        values.push(tisk_name);
    }
    if (tisk_description) {
        updates.push("tisk_description = ?");
        values.push(tisk_description);
    }
    if (priority || priority === 0) {
        updates.push("priority = ?");
        values.push(priority);
    }

    if (updates.length === 0) {
        return res.status(401).json({
            status: err ? "error" : "no_data" ,
            message: err ? "Виникла помилка під час виконання операції." : "Дані не знайдено або відсутні.",
            data: false,
            error: err ? err : false
        });
    }

    const sql = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);

    db.run(sql, values, (err) => {
        let er;
        if (err) {
            er = false
            console.error(err);
        } else er = true

        const aydit = {
            time: time,
            send: "/up - для изменения задачм",
            up: sql,
            post: values,
            error: err ? err : false
        }

        const jsonString = JSON.stringify(aydit);

        Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
            if (err) throw err
            if (AYDIT) {
                console.log(`обновил задачу ${req.body}`);
            }
        });

        res.status(200).json({
            status: err ? "error" : "success" ,
            message: err ? "Виникла помилка під час виконання операції." : "Операція виконана успішно",
            data: true,
            error: err ? err : false
        });
    });
});


router.delete('/delete', (req, res) => {

    const datas = req.body 
    console.log(datas)
    const time = new Date().toISOString()
    
    db.get("SELECT * FROM tasks WHERE id = ?", datas.id, (err, row) => {
        let er;
        if (err) {
            er = false
            console.error(err)
        } else er = true

        db.all("DELETE FROM tasks WHERE id = ?", datas.id, (err) => {
            if (err) {
                console.error(err)
            }

            const aydit = {
                time: time,
                send: "/delete - удаление задачи",
                post: datas,
                delete: row,
                error: err ? err : false
            }

            const jsonString = JSON.stringify(aydit);

            Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
                if (err) throw err
                if (AYDIT) {
                    console.log(`удалил задачу ${datas.id}`);
                }
            });

            res.status(200).json({
                status: err ? "error" : "success" ,
                message: err ? "Виникла помилка під час виконання операції." : "Операція виконана успішно",
                data: er,
                error: err ? err : false
            });
        })
    })
})


module.exports = router