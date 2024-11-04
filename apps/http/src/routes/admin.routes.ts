import { Router } from "express";
import { adminMiddleware } from "../middleware/admin.middleware";
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../types/index.types";
import client from "@repo/db/client"

export const adminRoute = Router()
// adding the middleware to all the routes in the admin middleware.
adminRoute.use(adminMiddleware)

adminRoute.post("/element", async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "validation error" })
        return
    }

    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl,

        }
    })
    res.json({ id: element.id, message: "element created successfully" })
})

adminRoute.put("/element/:elementId", async (req, res) => {
    const parsedData = UpdateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "vaildation error" })
    }
    client.element.update({
        where: {
            id: req.params.elementId,
        },
        data: {
            imageUrl: parsedData.data?.imageUrl,
        }
    })
    res.json({ message: "Element updated" })
})

adminRoute.post("/avatar", async (req, res) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return
    }
    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({ avatarId: avatar.id })
})

adminRoute.post("/map", async (req, res) => {
    const parsedData = CreateMapSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return
    }
    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split("x")[0]),
            height: parseInt(parsedData.data.dimensions.split("x")[1]),
            thumbnail: parsedData.data.thumbnail,
            mapElements: {
                create: parsedData.data.defaultElements.map(e => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })

    res.json({
        id: map.id
    })
})