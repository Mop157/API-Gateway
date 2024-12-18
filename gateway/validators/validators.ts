import sanitizeHtml from "sanitize-html";
import validator from "validator";

import { arg } from "../tools/net/Nmap/scripts";
import { Language_all } from "../utils/Languages";

const ERROR_MESSAGES = {
    INVALID_IP: "Invalid IP address or domain",
    INVALID_NUMBER: "The number is not correct",
    INTERNAL_PORTS: "Incorrect port list",
    INTERNAL_DUPLICATE_PORTS: "Duplicate ports were found in your ports, please remove them.",
    INTERNAL_ISARRAY: "Arguments must be an array.",
    INTERNAL_IN_ARGUMENTS: "Incorrect arguments", 
    INTERNAL_DUPLICATE_ARGUMENTS: "There are duplicates in your arguments, please remove them.",
    INTERNAL_IN_DATA_REQUEST: "Incorrect data in the request",
    INTERNAL_PASSWORD: "(Minimum 8 characters, at least one number, one uppercase and one lowercase letter)",
    INTERNAL_EMAIL: "Incorrect mail",
    INTERNAL_USERNAMELIMITE: "The nickname is too small",
};

export class ValidationError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export class Validator {
    static async html(target: string): Promise<void> {
        try {
            if (sanitizeHtml(target) !== target) throw new ValidationError(422, ERROR_MESSAGES.INVALID_IP);
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INVALID_IP);
        }
    }

    static async numbererror(number: number, min: number, max: number): Promise<void> {
        try {
            if (!Number.isInteger(Number(number)) || number <= min || number >= max) throw new ValidationError(422, ERROR_MESSAGES.INVALID_NUMBER);
        } catch {
            throw new ValidationError(415, ERROR_MESSAGES.INVALID_NUMBER);
        }
    }

    static async ipdomainerror(target: string): Promise<void> {
        try {
            if (!(validator.isIP(target) || validator.isFQDN(target))) throw new ValidationError(422, ERROR_MESSAGES.INVALID_IP);
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INVALID_IP);
        }
    }

    static async portserror(ports: string[]): Promise<void> {
        try {
            if (!ports.every(port => /^\d+$/.test(port) && Number(port) >= 0 && Number(port) <= 65535)) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_PORTS);
        } catch {
            throw new ValidationError(415, ERROR_MESSAGES.INTERNAL_PORTS);
        }
    }

    static async duplicateportserror(ports: string[]): Promise<void> {
        try {
            if ([...new Set(ports)].length !== ports.length) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_DUPLICATE_PORTS);
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_DUPLICATE_PORTS);
        }
    }

    static async isArrayerrorerror(argument: string[]): Promise<void> {
        try {
            if (!Array.isArray(argument)) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_ISARRAY);
        } catch {
            throw new ValidationError(415, ERROR_MESSAGES.INTERNAL_ISARRAY);
        }
    }

    static async in_argumentserror(argument: string[]): Promise<void> {
        try {
            if (!argument.every(args => arg.allowedArguments.includes(args))) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_ARGUMENTS);
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_ARGUMENTS);
        }
    }

    static async duplicateargumenterror(argument: string[]): Promise<void> {
        try {
            if ([...new Set(argument)].length !== argument.length) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_DUPLICATE_ARGUMENTS);
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_DUPLICATE_ARGUMENTS);
        }
    }

    static async usernloginerror(name: string, password: string, email: string | null = null): Promise<void> {
        try {
            if (email) {
                if ((sanitizeHtml(name) !== name) || (sanitizeHtml(password) !== password) || (sanitizeHtml(email) !== email)) {
                    throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_DATA_REQUEST)

                } else if ((validator.escape(name) !== name) || (validator.escape(password) !== password) || (validator.escape(email) !== email)) {
                    throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_DATA_REQUEST);
                }

            } else {
                if ((sanitizeHtml(name) !== name) || (sanitizeHtml(password) !== password)) {
                    throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_DATA_REQUEST)

                } else if ((validator.escape(name) !== name) || (validator.escape(password) !== password)) {
                    throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_DATA_REQUEST);
                }
            }
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_IN_DATA_REQUEST);
        }
    }

    static async Languageerror(Language: string): Promise<boolean> {
        try {
            if (!Language_all.includes(Language)) return false;
            else return true;
        } catch {
            return false;
        }
    }

    static async passworderror(password: string): Promise<void> {
        try {
            if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_PASSWORD)
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_PASSWORD)
        }
    }

    static async emailerror(email: string): Promise<void> {
        try {
            if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_EMAIL)
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_EMAIL)
        }
    }

    static async usernamelengtherror(username: string): Promise<void> {
        try {
            if (username.length < 4) throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_USERNAMELIMITE)
        } catch {
            throw new ValidationError(422, ERROR_MESSAGES.INTERNAL_USERNAMELIMITE)
        }
    }
}