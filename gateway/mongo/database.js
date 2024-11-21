const mongoose = require('mongoose');

(async () => {
    try {
      const uri = 'mongodb://127.0.0.1:27017/GATEWAY';
      await mongoose.connect(uri);
      console.log('Подключение к MongoDB успешно!');
    } catch (error) {
      console.error('Ошибка подключения:', error.message);
    }
  })()

  const objects = mongoose.model("DynamicObject", new mongoose.Schema({}, { strict: false }));

exports.datasave = async (user, server) => {
    try {
      const time = new Date().toISOString()

      const data = {
        time: time,
        user: user,
        server: server
      }
      const savedata = new objects(data)
      await savedata.save()
      return
    } catch (err) {
      console.error("ошибка: " + err)
      throw new Error(err);
      
    }
  }