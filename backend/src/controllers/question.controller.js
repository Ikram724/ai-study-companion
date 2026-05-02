import Progress from "../models/Progress.js"
import { generateQuestions as generateAiQuestions } from "../services/ai.service.js"

export const generateQuestions = async (req, res) => {
  const { topic, difficulty } = req.body
  if (!topic) return res.status(400).json({ message: "Topic required" })

  try {
    const data = await generateAiQuestions({ topic, difficulty: difficulty || "medium" })
    res.json(data)
  } catch (err) {
    console.error("AI Generation Error:", err.message)
    res.status(500).json({ message: "Failed to generate questions. Is AI service running?" })
  }
}


export const submitAnswers = async (req, res) => {
  const { topic, difficulty, questions, answers } = req.body
  if (!topic || !questions || !answers) {
    return res.status(400).json({ message: "Missing fields" })
  }

  let correct = 0
  questions.forEach((q, idx) => {
    const userAns = answers[idx]
    if (userAns === undefined) return

    const a = (q.answer ?? "").toString().trim().toLowerCase()
    const b = userAns.toString().trim().toLowerCase()

    if (a === b) correct++
  })

  const accuracy = Math.round((correct / questions.length) * 100)

  await Progress.create({
    userId: req.user.id,
    topic,
    difficulty: difficulty || "medium",
    accuracy
  })

  res.json({ accuracy, correct, total: questions.length })
}
