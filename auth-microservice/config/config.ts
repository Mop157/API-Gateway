import { config } from "dotenv";

config()

interface Config_interface {
    port: string | number,
    jwtSecret: string | undefined
}

const Config: Config_interface = {
    port: process.env.PORT || 3200,
    jwtSecret: process.env.JWT_SECRET
}

export default Config

