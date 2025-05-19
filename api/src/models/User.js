// api/src/models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin','edtech','mentor'],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User ||
       mongoose.model('User', UserSchema)