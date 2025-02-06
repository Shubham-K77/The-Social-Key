import { Server } from "socket.io"; //Server From Socket.io
import http from "http"; //Http Server From Built-In Module
import express from "express"; //Express
const app = express();
const server = http.createServer(app); //Enable Express With HTTP Server
const io = new Server(server, {
  //Enable Socket Server On Top Of HTTP Server
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
//HashMap To Store The Socket ID:
const userSocketMap = {};
//io.on is a method for setting up the event [Event-Emitter!]
io.on("connection", (socket) => {
  console.log("User Connected!", socket.id);
  //Retrieve The UserID:
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  //For Disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected!", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
