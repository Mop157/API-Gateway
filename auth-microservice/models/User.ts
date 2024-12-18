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
        const db = await dbPromise
        try {
            const saveuser = await db.run(
                        "INSERT INTO users (username, email, password, permissions, Language, TOKEN) VALUES (?, ?, ?, ?, ?, ?)",
                        [username, email, password, pеrmissions, Language, null]
                    );
            return saveuser?.lastID ? { id: saveuser.lastID, permissions: pеrmissions, Language: Language } : null;

        } catch (err) {
            throw err
        }
    }

    static async findByCredentials(username: string, password: string): Promise<user | null | undefined> {
        const db = await dbPromise
        try {
            const user: user | undefined = await db.get("SELECT * FROM users WHERE username = ?", [username])

            if (!user) return null

            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch ? user : null
        } catch (err) {
            console.error(err);
            return null
        }
    }
}
