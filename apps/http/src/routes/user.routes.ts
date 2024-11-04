import { Request, Response, Router } from "express";
import { signinSchema, signupSchema, updateMetadataSchema } from "../types/index.types";
import client from "@repo/db/client"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD_TOKEN } from "../config";
import { compare, hash } from "../script";
import { userMiddleware } from "../middleware/user.middleware";


export const userRoute = Router()

userRoute.post("/signup", async (req, res) => {
    const parsedData = signupSchema.safeParse(req.body)

    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid" })
        return
    }
    const hashedPassword = await hash(parsedData.data.password)
    try {
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "Admin" ? "Admin" : "User",
            }
        })
        res.status(200).json({ userId: user.id, success: true, message: "User created successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: "Error creating user" })
    }
})


userRoute.post("/signin", async (req, res) => {
    const parsedData = signinSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid User" })
        return
    }
    try {
        const user = await client.user.findFirst({
            where: {
                username: parsedData.data.username,
            }
        })
        if (!user) {
            res.status(400).json({ message: "Invalid credentials User Name" })
            return
        }
        const isPasswordValid = await compare(parsedData.data.password, user.password)

        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials Password" })
            return
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role,
        }, JWT_PASSWORD_TOKEN)
        console.log("Token returned", token);

        res.json({ token: token, success: true, message: "User authenticated successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: "Error authenticating user" })
    }
})

userRoute.post("/metadata", userMiddleware, async (req: Request, res: Response) => {
    const parsedData = updateMetadataSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({ message: "Validation failed" })
        return
    }
    try {
        await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })
        res.json({ message: "Metadata updated" })
    } catch (e) {
        console.log("error")
        res.status(400).json({ message: "Internal server error" })
    }
})

userRoute.get("/metadata/bulk", async (req, res) => {
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");
    //console.log(userIds)
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})