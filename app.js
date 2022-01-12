const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//'REQUIRE' ROUTES HERE
//Perform authentication using Firebase token

const app = express();
const usersRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const meetRoutes = require("./routes/meetRoutes");
const callRoutes = require("./routes/callRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
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

app.use("/call", callRoutes);
app.use("/users", usersRoutes);
app.use("/messages", messageRoutes);
app.use("/meet", meetRoutes);
app.use("/volunteer", volunteerRoutes);

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
      console.log(
        "mcdmmkmrjjrvnjv j vfv jvnrjnvrjnvrjnrjnvfrj" +
        socket.handshake.headers.groupIDs
      );
      // if (socket.handshake.headers.groupIDs) {
      //   socket.handshake.headers.groupIDs.forEach(element => {
      //     console.log("uhduhuhuehudbdbfubybyeybdyhb" + element);
      //     socket.join(element);
      //   });
      // }
      socket.join(chatId);

      socket.on("joining_group_room", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        console.log("uhduhuhuehudbdbfubybyeybdyhb" + jsonData);
        jsonData.groupIDs.forEach((element) => {
          socket.join(element);
        });
      });

      socket.on("join_all_groups", (groupIDs) => {
        groupIDs = JSON.parse(groupIDs);
        console.log(
          "uhduhuhuehudbdbfubybyeybdyhb77777777777777777777777777777777777" +
          groupIDs
        );
        console.log(groupIDs);
        groupIDs.groupIDs.forEach((element) => {
          socket.join(element);
        });
      });

      socket.on("video_call_invite", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        receiverChatID = jsonData.receiverChatID;
        senderChatID = jsonData.senderChatID;
        senderName = jsonData.senderName;
        videocall_roomID = jsonData.videocall_roomID;
        socket.to(receiverChatID).emit(
          "join_call",
          JSON.stringify({
            videocall_roomID: videocall_roomID,
            senderChatID: senderChatID,
            senderName: senderName
          })
        );
      });
      socket.on("video_call_end", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        receiverChatID = jsonData.receiverChatID;
        videocall_roomID = jsonData.videocall_roomID;
        socket.to(receiverChatID).emit(
          "end_call",
          JSON.stringify({
            videocall_roomID: videocall_roomID,
          })
        );
      });
      socket.on("call_accepted", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        senderChatID = jsonData.senderChatID;
        console.log("call_accepted", senderChatID);
        socket.to(senderChatID).emit(
          "receiver_accepted_call",
          JSON.stringify({
            "accepted": true
          })
        );
      });

      socket.on("voice_call_invite", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        receiverChatID = jsonData.receiverChatID;
        senderChatID = jsonData.senderChatID;
        senderName = jsonData.senderName;
        voicecall_roomID = jsonData.voicecall_roomID;
        socket.to(receiverChatID).emit(
          "join_voice_call",
          JSON.stringify({
            voicecall_roomID: voicecall_roomID,
            senderChatID: senderChatID,
            senderName: senderName
          })
        );
      });
      socket.on("voice_call_end", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        receiverChatID = jsonData.receiverChatID;
        voicecall_roomID = jsonData.voicecall_roomID;
        socket.to(receiverChatID).emit(
          "end_voice_call",
          JSON.stringify({
            voicecall_roomID: voicecall_roomID,
          })
        );
      });

      //Send message to only a particular user
      socket.on("send_message", (messageData) => {
        // console.log(message);
        messageData = JSON.parse(messageData);
        timestamp = messageData.timestamp;
        message = messageData.text;
        senderChatID = messageData.senderChatID;
        receiverChatID = messageData.receiverChatID;
        senderName =
          messageData.senderFirstName + " " + messageData.senderLastName;
        console.log(receiverChatID);
        //Send message to only that particular room
        // socket.broadcast.emit("test", "test");
        socket.to(receiverChatID).emit(
          "receive_message",
          JSON.stringify({
            timestamp: timestamp,
            message: message,
            senderChatID: senderChatID,
            receiverChatID: receiverChatID,
            senderName: senderName,
          })
        );
        // console.log("hi");
      });
      socket.on("creating_group", (newGroupData) => {
        // console.log(message);
        newGroupData = JSON.parse(newGroupData);
        console.log(newGroupData);
        _id = newGroupData._id;
        groupName = newGroupData.groupName;
        timestamp = newGroupData.timestamp;
        memberChatIDs = newGroupData.memberChatIDs;
        creatorChatID = newGroupData.receiverChatID;
        console.log(memberChatIDs);
        //Send message to only that particular room
        // socket.broadcast.emit("test", "test");
        console.log();
        socket.join(_id);
        console.log(
          "fmkmikmnkdnknjnjnfjnuddddddddddddddddddddddddddddddddddddddddd"
        );
        memberChatIDs.forEach((element) => {
          console.log(element);
          socket.to(element).emit(
            "inviting_to_group",
            JSON.stringify({
              timestamp: timestamp,
              message: "You Are Added",
              groupName: groupName,
              _id: _id,
              memberChatIDs: memberChatIDs,
              creatorChatID: creatorChatID,
            })
          );
        });
      });
      console.log(`Connected: ${socket.id}`);
      socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
    });
  })
  .catch((err) => console.log(err));
