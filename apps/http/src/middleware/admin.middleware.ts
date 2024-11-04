
import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD_TOKEN } from "../config";
import jwt from "jsonwebtoken";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers["authorization"]
    const token = headers?.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD_TOKEN) as { userId: string, role: string }
        if (decoded.role !== "Admin") {
            res.status(403).json({ message: "Unauthorized" })
            return
        }
        req.userId == decoded.userId
        next()
    } catch (error) {
        res.status(403).json({ message: "Unauthorized" })
        return
    }
}