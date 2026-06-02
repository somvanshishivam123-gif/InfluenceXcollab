const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../public")));

let users = {}; // socket.id -> user info

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user join
  socket.on("join", ({ userId, role }) => {
    users[socket.id] = { userId, role };
  });

  // join private room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  // send private message
  socket.on("send_message", ({ roomId, message }) => {
    io.to(roomId).emit("receive_message", {
      message,
      sender: users[socket.id]?.userId
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});