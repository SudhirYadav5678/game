import express from "express"
import { router } from "./routes/index.routes"


const app = express()


app.use(express.json())
app.use("/api/v1", router)
app.listen(process.env.PORT || 8000, () => {
    console.log("Server is listening on port 8000");
})