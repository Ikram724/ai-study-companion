import mongoose from "mongoose"

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    accuracy: { type: Number, required: true }
  },
  { timestamps: true }
)

export default mongoose.model("Progress", progressSchema)
