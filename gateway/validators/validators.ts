import sanitizeHtml from "sanitize-html";
import validator from "validator";

import { arg } from "../tools/net/Nmap/scripts";

const ERROR_MESSAGES = {
    INVALID_IP: "Invalid IP address or domain",
    INVALID_NUMBER: "The number is not correct",
    INTERNAL_PORTS: "Incorrect port list",
    INTERNAL_DUPLICATE_PORTS: "Duplicate ports were found in your ports, please remove them.",
    INTERNAL_ISARRAY: "Arguments must be an array.",
    INTERNAL_IN_ARGUMENTS: "Incorrect arguments", 
    INTERNAL_DUPLICATE_ARGUMENTS: "There are duplicates in your arguments, please remove them."
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
            if (sanitizeHtml(target) == target) return
            else throw new ValidationError(400, ERROR_MESSAGES.INVALID_IP);
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INVALID_IP);
        }
    }

    static async numbererror(number: number, min: number, max: number): Promise<void> {
        try {
            if (!Number.isInteger(Number(number)) || number <= min || number >= max) {
                throw new ValidationError(400, ERROR_MESSAGES.INVALID_NUMBER);
            }
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INVALID_NUMBER);
        }
    }

    static async ipdomainerror(target: string): Promise<void> {
        try {
            if (!(validator.isIP(target) || validator.isFQDN(target))) {
                throw new ValidationError(400, ERROR_MESSAGES.INVALID_IP);
            }
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INVALID_IP);
        }
    }

    static async portserror(ports: string[]): Promise<void> {
        try {
            if (!ports.every(port => /^\d+$/.test(port) && Number(port) >= 0 && Number(port) <= 65535)) throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_PORTS);
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_PORTS);
        }
    }

    static async duplicateportserror(ports: string[]): Promise<void> {
        try {
            if ([...new Set(ports)].length !== ports.length) throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_DUPLICATE_PORTS);
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_DUPLICATE_PORTS);
        }
    }

    static async isArrayerrorerror(argument: string[]): Promise<void> {
        try {
            if (!Array.isArray(argument)) throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_ISARRAY);
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_ISARRAY);
        }
    }

    static async in_argumentserror(argument: string[]): Promise<void> {
        try {
            if (!argument.every(args => arg.allowedArguments.includes(args))) throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_IN_ARGUMENTS);
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_IN_ARGUMENTS);
        }
    }

    static async duplicateargumenterror(argument: string[]): Promise<void> {
        try {
            if ([...new Set(argument)].length !== argument.length) throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_DUPLICATE_ARGUMENTS);
        } catch {
            throw new ValidationError(400, ERROR_MESSAGES.INTERNAL_DUPLICATE_ARGUMENTS);
        }
    }
}