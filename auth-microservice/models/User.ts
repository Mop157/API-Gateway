import { RunResult } from "sqlite3";
import bcrypt from "bcryptjs";

import dbPromise from "../config/database";

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
        const db = await dbPromise
        return db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err: Error | null, row: user | null): Error | null | user => {
            if (err) throw err
            return row
        });
    }

    static async create(username: string, email: string, password: string, Language: string): Promise<Error | null | Pick<user, "id" | "permissions" | "Language">> {
        const pеrmissions: string = 'USER';
        // const db = await dbPromise
        let error: Error | undefined;
        let row: Pick<user, "id" | "permissions" | "Language"> | undefined
        try {
            const x = await dbPromise
             .then(db => {
                    db.run(
                        "INSERT INTO users (username, email, password, permissions, Language, TOKEN) VALUES (?, ?, ?, ?, ?, ?)",
                        [username, email, password, pеrmissions, Language, null],
                        (err: Error | null) => {
                            console.log(413414242);
                            if (err) {
                                error = err
                            } else {
                                row = {
                                    id: 77,
                                    permissions: pеrmissions,
                                    Language: Language
                                }
                            }
                        }
                    );
                })
             .catch(err => {
                    error = err
                })
            // await new Promise(resolve => setTimeout(resolve, 2000)); 
            console.log(x);
            return row ?? null 

        } catch (err) {
            throw err
        }
    }

    static async findByCredentials(username: string, password: string): Promise<Error | user | null | undefined> {
        const db = await dbPromise
        return await db.get("SELECT * FROM users WHERE username = ?", [username], async (err: Error | null, user: user | null): Promise<Error | user | null> => {
            if (err) throw err
            if (!user) return null

            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch ? user : null
        });
    }
}
