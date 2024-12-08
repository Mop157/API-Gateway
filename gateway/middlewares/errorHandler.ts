import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // console.error(err.stack);
    res.status(500).json({
        error: {
            message: err.message || 'Внутрішня помилка сервера',
            status: err.status || 500,
        }
    });
};

