import jwt from "jsonwebtoken"

export const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const token = auth.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { id: decoded.id }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
