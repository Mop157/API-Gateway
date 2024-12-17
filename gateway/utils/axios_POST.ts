import axios, { AxiosResponse } from 'axios';

import { ValidationError } from "../validators/validators";
import { datasave } from '../mongo/database';

export async function microserverRequest<T>(
    endpoint: string,
    data: any
): Promise<void | T> {

    try {
        const res: AxiosResponse<T> = await axios.post(
            endpoint,
            data,
            { headers: { 'Content-Type': 'application/json' } }
        );

        await datasave(data, res.data);

        return res.data

    } catch (err: any) {
        if (!err?.response) console.error(err)

        await datasave(data, {
            code: err.code,
            message: err.message,
            response: err.response ? err.response.status : "нету нічего)"
        })
        throw new ValidationError(500, "error: microserver not responding")
    }
}