// File: api/src/sockets/chatGateway.js
import ChatMessage from '../models/ChatMessage.js'

/**
 * chatGateway sets up all the socket event handlers for real-time chat.
 * Each socket can join/leave rooms (sessions) and send messages.
 */
export default function chatGateway(io, socket) {
  // When a client wants to join a room (e.g. a particular session)
  socket.on('joinRoom', async ({ sessionId, userId, userName }) => {
    try {
      socket.join(sessionId)
      console.log(`🟢  User ${userName} (${userId}) joined room ${sessionId}`)

      // Load last 50 messages for this session and send to the joining socket
      const history = await ChatMessage.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean()
      // reverse to oldest-first
      socket.emit('chatHistory', history.reverse())
    } catch (err) {
      console.error('❌  joinRoom error:', err)
    }
  })

  // When a client leaves a room
  socket.on('leaveRoom', ({ sessionId, userId, userName }) => {
    socket.leave(sessionId)
    console.log(`🔴  User ${userName} (${userId}) left room ${sessionId}`)
  })

  // When a client sends a new message
  socket.on('sendMessage', async ({ sessionId, userId, userName, content }) => {
    try {
      // Persist to MongoDB
      const message = await ChatMessage.create({
        sessionId,
        senderId: userId,
        senderName: userName,
        content,
        createdAt: new Date(),
      })

      // Broadcast to everyone in the room
      io.to(sessionId).emit('newMessage', message)
      console.log(`💬  [${sessionId}] ${userName}: ${content}`)
    } catch (err) {
      console.error('❌  sendMessage error:', err)
    }
  })

  // Clean up on disconnect
  socket.on('disconnect', (reason) => {
    console.log(`⚡️  Socket ${socket.id} disconnected: ${reason}`)
  })
}