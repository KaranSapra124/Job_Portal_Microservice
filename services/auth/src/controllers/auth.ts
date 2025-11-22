import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
    try {
        
    } catch (error:any) {
        res.status(500).json({
            message:error.message,
        })
    }
}