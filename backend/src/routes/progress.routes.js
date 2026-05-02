import express from "express"
import { getMyProgress } from "../controllers/progress.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()
router.get("/", protect, getMyProgress)

export default router
