const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//'REQUIRE' ROUTES HERE
//Perform authentication using Firebase token

const app = express();
const usersRoutes = require('./routes/userRoutes');
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

app.use("/", usersRoutes);

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
      chatId = socket.handshake.headers.userid;
      console.log(chatId);
      socket.join(chatId);

      //Send message to only a particular user
      socket.on('send_message', message => {
        message = JSON.parse(message);
        timestamp = message.timestamp
        message = message.message
        senderChatID = message.senderChatID
        receiverChatID = message.receiverChatID

        //Send message to only that particular room
        socket.in(receiverChatID).emit('receive_message', {
          'timestamp': timestamp,
          'message': message,
          'senderChatID': senderChatID,
          'receiverChatID': receiverChatID,
        })
      })
      console.log(`Connected: ${socket.id}`);
      socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
      socket.on("msg", () => console.log(`Msg: ${socket.id}`));
    });
  })
  .catch((err) => console.log(err));
