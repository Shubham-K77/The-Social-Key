import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import messageModel from "../modules/message/message.model.js";
import conversationModel from "../modules/conversation/conversation.model.js";

// Create the Express app and server
const app = express();
const server = createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://the-social-key.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
  path: "/socket.io/",
  allowEIO3: true,
  connectTimeout: 45000,
});

const userSocketMap = {};

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

// Handle client connection
io.on("connection", (socket) => {
  console.log("User Connected!", socket.id);
  // Handle setting userId after connection
  socket.on("setUserId", (userId) => {
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the list of online users
    }
  });

  // Mark messages as seen
  socket.on("markMessagesAsSeen", async (data) => {
    try {
      const { conversationId, userId } = data;
      await messageModel.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await conversationModel.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      const recipientSocketId = userSocketMap[userId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messagesSeen", { conversationId });
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected!", socket.id);
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
