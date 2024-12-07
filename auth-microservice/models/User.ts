import { RunResult } from "sqlite3";
import db from "../config/database";
import bcrypt from "bcryptjs";

export interface user {
    id: number
    username: string
    email: string
    password: string
    permissions: string
    Language: string
    token: string
    path?: string
}

export default class User {
    
    static async findByUsernameOrEmail(username: string, email: string): Promise<Error | null | undefined | user> {
        return db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err: Error | null, row: user | null): Error | null | user => {
            if (err) throw err
            return row
        });
    }

    static async create(username: string, email: string, password: string, Language: string): Promise<Error | null | Pick<user, "id" | "permissions" | "Language">> {
        const pеrmissions: string = 'USER';
        return new Promise<Error | Pick<user, "id" | "permissions" | "Language">>((resolve, reject) => {
            db.run("INSERT INTO users (username, email, password, permissions, Language, TOKEN) VALUES (?, ?, ?, ?, ?)", 
            [username, email, password, pеrmissions, Language, null], 
            (id: RunResult, err: Error): void => {
                if (err) return reject(err)
                resolve({
                    id: id.lastID,
                    permissions: pеrmissions,
                    Language: Language
                })
            });
        })
    }

    static async findByCredentials(username: string, password: string): Promise<Error | user | null | undefined> {
        return await db.get("SELECT * FROM users WHERE username = ?", [username], async (err: Error | null, user: user | null): Promise<Error | user | null> => {
            if (err) throw err
            if (!user) return null

            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch ? user : null
        });
    }
}
