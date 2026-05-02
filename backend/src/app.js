import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import questionRoutes from "./routes/question.routes.js"
import progressRoutes from "./routes/progress.routes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("API running"))

app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes)
app.use("/api/progress", progressRoutes)

export default app
