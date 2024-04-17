const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { join } = require("node:path");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

app.get("/:room", (req, res) => {
  const room = req.params.room;
  const foundRoom = Object.keys(rooms).find((roomname) => roomname == room);
  if (foundRoom) {
    res.render("room");
  } else {
    res.redirect("/");
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("newRoom", (name) => {
    rooms[name] = { user: {} };
    console.log(rooms);
    socket.broadcast.emit("newRoom", name);
    socket.emit("redirectToRoom", name);
  });
  socket.on("joinUser", (data) => {
    socket.join(data.roomId);
    rooms[data.roomId].user[socket.id] = data.user;
    console.log(rooms);
    // socket.to(roomId).broadcast.emit("user-connected", data.name);
  });

  socket.on("move", (data) => {
    socket.broadcast.to(data.roomId).emit("move", { x: data.x, y: data.y });
  });

  socket.on("draw", (data) => {
    socket.broadcast.to(data.roomId).emit("draw", { x: data.x, y: data.y });
  });
  socket.on("clear", (data) => {
    socket.broadcast.to(data.roomId).emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
