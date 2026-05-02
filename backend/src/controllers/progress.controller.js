import Progress from "../models/Progress.js"

export const getMyProgress = async (req, res) => {
  const data = await Progress.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(data)
}
