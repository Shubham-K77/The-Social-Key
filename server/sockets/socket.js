import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
//Send The Recepient Id:
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {};
// io.on is a method for setting up the connection!
io.on("connection", (socket) => {
  console.log("User Connected!", socket.id);
  // Retrieve The UserID:
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;
  // Emit The Event:
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // For Disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected!", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
