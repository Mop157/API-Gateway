import jwt from "jsonwebtoken";
import Config from "../config/config";

type JWT = {
    
}

exports.signToken = (payload): string => {
    return jwt.sign(payload, Config.jwtSecret || "123456789", { expiresIn: '30d' });
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        return null;
    }
};
