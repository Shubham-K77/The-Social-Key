import { Server } from "socket.io";
import http from "http";
import express from "express";
import messageModel from "../modules/message/message.model.js";
import conversationModel from "../modules/conversation/conversation.model.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("User Connected!", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("markMessagesAsSeen", async (data) => {
    try {
      const { conversationId, userId } = data;
      await messageModel.updateMany(
        {
          conversationId: conversationId,
          seen: false,
        },
        {
          $set: { seen: true },
        }
      );
      await conversationModel.updateOne(
        { _id: conversationId },
        {
          $set: {
            "lastMessage.seen": true,
          },
        }
      );
      io.to(userSocketMap[userId]).emit("messagesSeen", {
        conversationId: conversationId,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected!", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));  });
});

export { io, server, app };
