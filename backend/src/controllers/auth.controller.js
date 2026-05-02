import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" })
    }

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User already exists" })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    res.json({
      token: makeToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({ message: error.message || "Server error during registration" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" })
  }

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "Invalid credentials" })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ message: "Invalid credentials" })

  res.json({
    token: makeToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  })
}
