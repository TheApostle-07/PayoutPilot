// File: api/src/models/ChatMessage.js
import mongoose from 'mongoose'

const ChatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
  },
  {
    // automatically add `createdAt` and `updatedAt` fields
    timestamps: true,
  }
)

// Prevent model overwrite upon repeated imports (e.g. in development)
const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model('ChatMessage', ChatMessageSchema)

export default ChatMessage