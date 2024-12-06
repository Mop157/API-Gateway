import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// const hashedPassword = bcrypt.hashSync('password', 10);

sqlite3.verbose();

async function initializeDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    const db = await open({
        filename: './config/database.db',
        driver: sqlite3.Database
    });
    await db.exec(` CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        permissions TEXT,
        language TEXT,
        token TEXT
        ) `);
    return db;
}
const dbPromise = await initializeDatabase();

export default dbPromise;