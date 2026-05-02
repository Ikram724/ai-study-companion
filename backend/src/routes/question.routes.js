import express from "express"
import { generateQuestions, submitAnswers } from "../controllers/question.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/generate", protect, generateQuestions)
router.post("/submit", protect, submitAnswers)

export default router
