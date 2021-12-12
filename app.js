const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//'REQUIRE' ROUTES HERE

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

//'USE' ROUTES HERE

app.use("/", (req, res, next) => {
  console.log("No match found.");
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//BELOW CODE IS FOR SOCKET.IO AND CHATTING
mongoose
  .connect(
    "mongodb+srv://rushit:never-too-old-project-test@cluster0.w1zfz.mongodb.net/never-too-old-db?retryWrites=true&w=majority"
  )
  .then((result) => {
    const server = app.listen(5000);

    const io = require("./socket").initServer(server);
    io.on("connection", (socket) => {
      console.log(`Connected: ${socket.id}`);
      socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
      socket.on("join", (room) => {
        console.log(`Socket ${socket.id} joining ${room}`);
        socket.join(room);
      });
      socket.on("chat", (data) => {
        const { message, room } = data;
        console.log(`msg: ${message}, room: ${room}`);
        socket.broadcast.to(room).emit("chat", message);
      });
    });
  })
  .catch((err) => console.log(err));
