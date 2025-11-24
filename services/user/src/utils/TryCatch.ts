import { Request, Response, NextFunction, RequestHandler } from 'express'
import Errorhandler from './errorHandler.js'

export const TryCatch = (controller: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => async (req, res, next) => {
    try {
        await controller(req, res, next)
    } catch (error: any) {
        if (error instanceof Errorhandler) {
            return res.status(error.statusCode).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}