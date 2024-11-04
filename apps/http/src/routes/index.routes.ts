import { Router } from "express";
import { userRoute } from "./user.routes";
import { adminRoute } from "./admin.routes";
import { spaceRouter } from "./space.routes";
import client from "@repo/db/client"

export const router = Router()

router.use("/user", userRoute)


router.get("/elements", async (req, res) => {
    const elements = await client.element.findMany()

    res.json({
        elements: elements.map(e => ({
            id: e.id,
            imageUrl: e.imageUrl,
            width: e.width,
            height: e.height,
            static: e.static
        }))
    })
})

router.get("/avatars", async (req, res) => {
    const avatars = await client.avatar.findMany()
    res.json({
        avatars: avatars.map(x => ({
            id: x.id,
            imageUrl: x.imageUrl,
            name: x.name
        }))
    })
})

router.use("/admin", adminRoute)
router.use("/space", spaceRouter)