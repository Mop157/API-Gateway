import mongoose from "mongoose";

(async (): Promise<void> => {
    try {
      const uri: string = 'mongodb://127.0.0.1:27017/GATEWAY';
      await mongoose.connect(uri);
      console.log('Підключення до MongoDB успішно!');
    } catch (error: any) {
      console.error('Помилка підключення:', error.message);
    }
  })()

  const objects = mongoose.model("DynamicObject", new mongoose.Schema({}, { strict: false }));


// когда нибуть типизивую, главное не забыть!
function removeCircular(obj: any): any {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    }));
  }
  
export const datasave = async (user: any, server: any): Promise<any> => {
    try {
      const time = new Date().toISOString()

      const data = {
        time: time,
        user: user,
        server: await removeCircular(server)
      }
      const savedata = new objects(data)
      await savedata.save()
      return
    } catch (err: any) {
      console.error("помилка: " + err)
      throw err;
      
    }
  }