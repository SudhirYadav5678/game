import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD_TOKEN } from "../config";
import jwt from "jsonwebtoken";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers["authorization"]
    const token = headers?.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: 'Unauthorized' });
        return
    }
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD_TOKEN) as { role: string, userId: string }
        req.userId == decoded.userId
        next()
    } catch (error) {
        res.status(403).json({ message: "Unauthorized" })
        return
    }
}



// import jwt from "jsonwebtoken";
// import { JWT_PASSWORD_TOKEN } from "../config";
// import { NextFunction, Request, Response } from "express";

// export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const header = req.headers["authorization"];
//     const token = header?.split(" ")[1];
//     console.log(req.route.path)
//     console.log(token)

//     if (!token) {
//         res.status(403).json({ message: "Unauthorized" })
//         return
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_PASSWORD_TOKEN) as { role: string, userId: string }
//         req.userId = decoded.userId
//         next()
//     } catch (e) {
//         res.status(401).json({ message: "Unauthorized" })
//         return
//     }
// }