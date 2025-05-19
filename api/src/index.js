// File: api/src/index.js

// 1. Load .env first
import 'dotenv/config';

import express from 'express';
import cors from 'cors';                 // ← add this
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// 2. Import your routers & socket handlers
import authRouter from './routers/auth.js';
import chatRouter from './routers/chat.js';
import chatGateway from './sockets/chatGateway.js'; // make sure this is imported

// 3. Ensure we actually have a URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('🛑  MONGODB_URI environment variable is not set');
  process.exit(1);
}

// 4. Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => {
    console.error('🛑  MongoDB connection error:', err);
    process.exit(1);
  });

const app    = express();
const server = http.createServer(app);

// 5. Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  },
});

// 6. Express middleware
app.use(cors({                          // ← enable CORS for your frontend
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// 7. Mount your REST routes
app.use('/auth',    authRouter);    // handles /auth/register
app.use('/chat',    chatRouter);    // handles /chat routes
// app.use('/mentor',  mentorRouter);
// app.use('/session', sessionRouter);
// app.use('/payout',  payoutRouter);
// app.use('/receipt', receiptRouter);

// 8. Wire up WebSockets
io.on('connection', (socket) => {
  console.log(`🔌  Socket connected: ${socket.id}`);
  chatGateway(io, socket);
});

// 9. Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀  API + WS listening on port ${PORT}`);
});