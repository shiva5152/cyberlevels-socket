import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const candidateSockets = {};

const addNewUser = (mongoId, socketId) => {
  candidateSockets[mongoId] = socketId;
};

io.on("connection", (socket) => {
  console.log("some one has connected");
  // addNewUser(mongoId, socket.id);
  socket.on("newUser", (mongoId) => {
    console.log(mongoId, socket.id);
    addNewUser(mongoId, socket.id);
  });
  // sendNotification
  socket.on("sendNotification", ({ senderId, receiverId, data }) => {
    // console.log(candidateSockets[receiverId], receiverId);
    console.log(candidateSockets);
    console.log(receiverId);

    io.to(candidateSockets[receiverId]).emit("getNotification", {
      senderId,
      notification: data,
    });
  });
  // send message
  socket.on("sendMessage", ({ senderId, receiverId, data }) => {
    console.log(candidateSockets);

    io.to(candidateSockets[receiverId]).emit("getMessage", {
      senderId,
      message: data,
    });
  });

  socket.on("disconnect", () => {
    console.log("someone has left");
  });
});
const socketPort = process.env.SOCKET_PORT || 7000;
server.listen(socketPort, () => {
  console.log(`⚡️[server]: Server is running at port ${socketPort}`);
});
