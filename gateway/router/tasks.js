// const express = require('express');
// const axios = require('axios');
// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// const router = express.Router();
// const { AYDIT, URL_task } = require('../config.json');
// const Aydit_db = new sqlite3.Database(path.join(__dirname, '../SQL/aydit.db'));

// Aydit_db.run(`CREATE TABLE IF NOT EXISTS objects (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, data TEXT)`); // const timestamp = new Date().toISOString();

// // Базовый маршрут для GET-запроса
// // router.get('/', (req, res) => {
// //     const time = new Date().toISOString()

// //     const aydit = {
// //         time: time,
// //         send: "/ - зашел посмотреть главную страницу задач",
// //         received: 'Добро пожаловать в наш API!',
// //         error: false
// //     }

// //     const jsonString = JSON.stringify(aydit);

// //     Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
// //         if (err) throw err
// //         if (AYDIT) {
// //             console.log(`зашел на главную страницу`);
// //         }
// //     });

// //     res.send('Добро пожаловать в наш API!');
// // });

// router.get('/list', async (req, res) => {
//     const time = new Date().toISOString()
    
//     let row = await axios.get(URL_task + '/task/list', {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).catch( async (error) => {
//         if (error.status == 401) return error.response.data
//         console.error(error)
//         return false
//     })

//     const aydit = {
//         time: time,
//         send: "/list - для получения списка задач",
//         received: row.data,
//         error: row ? false : true,
//     }

//     const jsonString = JSON.stringify(aydit);

//     Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
//         if (err) throw err
//         if (AYDIT) {
//             console.log(`отримал список всех задач`);
//         }
//     });

//     if (!row) {
//         return res.status(401).join({
//             id: -1,
//             tisk_name: "error",
//             priority: -1
//         })
//     }

//     res.status(200).json(row.data);
// });

// router.post('/open', async (req, res) => {
//     const time = new Date().toISOString()

//     const row = await axios.post(URL_task + '/task/open', req.body, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).catch( async (error) => {
//         if (error.status == 401) return error.response.data
//         console.error(error)
//         return false
//     })

//     const aydit = {
//         time: time,
//         send: "/open - для получения определеной задачи",
//         post: req.body,
//         received: row?.data?.data ? row.data.data : null,
//         error: row ? false : true
//     }

//     const jsonString = JSON.stringify(aydit);

//     Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
//         if (err) throw err
//         if (AYDIT) {
//             console.log(`посмотрел задачу `);
//         }
//     });

//     if (row?.data?.data) {
//         res.status(200).json(row.data);
//     } else {
//         if (row === false) return res.status(500).json({
//             status: "error",
//             message: "помилка при надсиланні запиту на мікросервер.",
//             data: null,
//             error: true
//         })
//         res.status(401).json(row)
//     }

// })

// router.post('/add', async (req, res) => { // добавление задачи
//     try {
//         const time = new Date().toISOString()
//         const datas = req.body

//         const row = await axios.post(URL_task + '/task/add', datas, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }).catch( async (error) => {
//             if (error.status == 401) return error.response.data
//             console.error(error)
//             return false
//         })

//         const aydit = {
//             time: time,
//             send: "/add - для создания задачи",
//             post: datas,
//             received: row?.data?.data ? row.data.data : null,
//             error: row ? false : true
//         }

//         const jsonString = JSON.stringify(aydit);

//         Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
//             if (err) throw err
//             if (AYDIT) {
//                 console.log(`добавил задачу ${datas.tisk_name}`);
//             }
//         });

//         if (row?.data?.data) {
//             res.status(200).json(row.data);
//         } else {
//             if (row === false) return res.status(500).json({
//                 status: "error",
//                 message: "помилка при надсиланні запиту на мікросервер.",
//                 data: null,
//                 error: true
//             })
//             res.status(401).json(row)
//         }

//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "помилка при надсиланні запиту на сервер.",
//             data: null,
//             ERROR: error,
//             error: true
//         })
//     }
// });

// router.put('/up', async (req, res) => {
//     const datas = req.body;
//     const time = new Date().toISOString()

//     const row = await axios.put(URL_task + '/task/up', datas, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).catch( async (error) => {
//         if (error.status == 401) return error.response.data
//         console.error(error)
//         return false
//     })

//     const aydit = {
//         time: time,
//         send: "/up - для изменения задачм",
//         post: datas,
//         error: row ? false : true
//     }

//     const jsonString = JSON.stringify(aydit);

//     Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
//         if (err) throw err
//         if (AYDIT) {
//             console.log(`добавил задачу ${datas.tisk_name}`);
//         }
//     });

//     if (row?.data?.data) {
//         res.status(200).json(row.data);
//     } else {
//         if (row === false) return res.status(500).json({
//             status: "error",
//             message: "помилка при надсиланні запиту на мікросервер.",
//             data: null,
//             error: true
//         })
//         res.status(401).json(row)
//     }
// });


// router.delete('/delete', async (req, res) => {

//     const datas = req.body 
//     const time = new Date().toISOString()

//     const row = await axios.delete(URL_task + '/task/delete', {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: {
//             id: datas.id
//         }
//     }).catch( async (error) => {
//         if (error.status == 401) return error.response.data
//         console.error(error)
//         return false
//     })

//     const aydit = {
//         time: time,
//         send: "/delete - удаление задачи",
//         post: datas,
//         received: row?.data?.data ? row.data.data : null,
//         rror: row ? false : true
//     }

//     const jsonString = JSON.stringify(aydit);

//     Aydit_db.run(`INSERT INTO objects (time, data) VALUES (?, ?)`, [time, jsonString], (err) => {
//         if (err) throw err
//         if (AYDIT) {
//             console.log(`удалил задачу ${datas.id}`);
//         }
//     });

//     if (row?.data?.data) {
//         res.status(200).json(row.data);
//     } else {
//         if (row === false) return res.status(500).json({
//             status: "error",
//             message: "помилка при надсиланні запиту на мікросервер.",
//             data: null,
//             error: true
//         })
//         res.status(401).json(row)
//     }  
// })


// module.exports = router