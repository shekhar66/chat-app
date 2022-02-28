const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const filter = require("bad-words");
const {
  generateMessages,
  generateLocationMessages,
} = require("../utils/generateMessages");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
const port = process.env.PORT || 8080;

// Create server
const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("connection established...!!");

  socket.on("join", (user, room) => {
    io.emit("message", "Welcome");
    socket.to(room).broadcast.emit(generateMessages(`${user} has joined room`));
  });

  // Send Message
  socket.on("sendMessage", (message, callback) => {
    const fil = new filter();
    if (fil.isProfane(message)) {
      return callback("Profanity is not allowed");
    }
    io.emit("message", generateMessages(message));
    callback("Message is delievered");
  });
  //   Show to other users when you joined room
  socket.broadcast.emit(
    "message",
    generateMessages("A new user has joined room...")
  );
  //   Show to other users when you left room
  socket.on("disconnect", () => {
    io.emit("message", generateMessages("User left the group"));
  });

  //  Send Location to user
  socket.on("sendLocation", (location, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessages(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log("server is running at " + port);
});
