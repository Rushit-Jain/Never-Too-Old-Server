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
const miscellaneousRoutes = require("./routes/miscellaneousRoutes");
app.use("/uploads", express.static(process.cwd() + "/uploads"));
app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  next();
});

//'USE' ROUTES HERE

app.use("/call", callRoutes);
app.use("/users", usersRoutes);
app.use("/messages", messageRoutes);
app.use("/meet", meetRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/miscellaneous", miscellaneousRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//BELOW CODE IS FOR SOCKET.IO AND CHATTING
var onlineuser = {};
var offlineMsgs = {};
var pendingMeetAcceptanceNotifications = {};
var pendingMeetBookingNotifications = {};
mongoose
  .connect(
    "mongodb+srv://rushit:never-too-old-project-test@cluster0.w1zfz.mongodb.net/never-too-old-db?retryWrites=true&w=majority"
  )
  .then((result) => {
    const server = app.listen(process.env.PORT || 5000);

    const io = require("./socket").initServer(server);

    const volunteerSlots = require("./volunteer-slots");
    const elderSlots = require("./elder-slots");
    volunteerSlots.initialize();
    elderSlots.initialize();

    io.on("connection", (socket) => {
      chatId = socket.handshake.headers.userid;
      loggingIN = socket.handshake.headers.loggingin;
      // friendIDs = socket.handshake.headers.friendids
      console.log("rrrrrr" + onlineuser);
      onlineuser[chatId] = socket.id;
      // if (socket.handshake.headers.groupIDs) {
      //   socket.handshake.headers.groupIDs.forEach(element => {
      //     console.log("uhduhuhuehudbdbfubybyeybdyhb" + element);
      //     socket.join(element);
      //   });
      // }
      friendStatus = [];
      friendIDS = [];
      socket.join(chatId);
      // console.log(loggingIN);
      // socket.on("user-login", (data) => {
      //   jsonData = JSON.parse(data);
      //   console.log(jsonData.senderChatID);
      //   console.log(chatId);
      //   console.log(offlineMsgs[chatId]);
      //   console.log(offlineMsgs);
      //   if (offlineMsgs.hasOwnProperty(jsonData.senderChatID))
      //     delete offlineMsgs[chatId];
      // });
      socket.on("first_emit", (data) => {
        const withTimeout = (onSuccess, onTimeout, timeout) => {
          let called = false;

          const timer = setTimeout(() => {
            if (called) return;
            called = true;
            onTimeout();
          }, timeout);

          return (...args) => {
            if (called) return;
            called = true;
            clearTimeout(timer);
            onSuccess.apply(this, args);
          };
        };
        jsonData = JSON.parse(data);
        // console.log(typeof jsonData.loggingIN);
        if (offlineMsgs.hasOwnProperty(chatId)) {
          if (jsonData.loggingIN) {
            delete offlineMsgs[chatId];
          } else {
            offlineMsgs[chatId].forEach((e) => {
              io.sockets.sockets[onlineuser[chatId]].emit(
                "receive_message",
                JSON.stringify({
                  timestamp: e["timestamp"],
                  message: e["message"],
                  senderChatID: e["senderChatID"],
                  receiverChatID: e["receiverChatID"],
                  senderName: e["senderName"],
                }),
                withTimeout(
                  () => {
                    console.log("success!");
                  },
                  () => {
                    console.log("err");
                    if (offlineMsgs.hasOwnProperty(receiverChatID)) {
                      offlineMsgs[receiverChatID] = [
                        ...offlineMsgs[receiverChatID],
                        {
                          timestamp: timestamp,
                          message: message,
                          senderChatID: senderChatID,
                          receiverChatID: receiverChatID,
                          senderName: senderName,
                        },
                      ];
                    } else {
                      offlineMsgs[receiverChatID] = [
                        {
                          timestamp: timestamp,
                          message: message,
                          senderChatID: senderChatID,
                          receiverChatID: receiverChatID,
                          senderName: senderName,
                        },
                      ];
                    }
                  },
                  1000
                )
              );
            });
            delete offlineMsgs[chatId];
          }
        }
      });
      if (pendingMeetAcceptanceNotifications.hasOwnProperty(chatId)) {
        pendingMeetAcceptanceNotifications[chatId].forEach((e) =>
          io.in(chatId).emit("meet_accepted", e)
        );
        delete pendingMeetAcceptanceNotifications[chatId];
      }
      if (pendingMeetBookingNotifications.hasOwnProperty(chatId)) {
        pendingMeetBookingNotifications[chatId].forEach((e) =>
          io.in(chatId).emit("booked_meet", e)
        );
        delete pendingMeetBookingNotifications[chatId];
      }
      socket.on("getOnlineUser", (jsonData, ack) => {
        jsonData = JSON.parse(jsonData);
        friendIDS = jsonData.friendIDs;
        jsonData.friendIDs.forEach((id) => {
          if (onlineuser[id] != undefined) {
            friendStatus.push(id);
          }
        });
        // console.log(friendIDS);
        // console.log(onlineuser);
        // console.log(friendStatus);
        ack(JSON.stringify(friendStatus));
        friendStatus.forEach((id) => {
          socket
            .to(id)
            .emit("IamOnline", JSON.stringify({ _id: jsonData._id }));
        });
      });

      socket.on("joining_group_room", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        // console.log("uhduhuhuehudbdbfubybyeybdyhb" + jsonData);
        jsonData.groupIDs.forEach((element) => {
          socket.join(element);
        });
      });

      socket.on("join_all_groups", (groupIDs) => {
        groupIDs = JSON.parse(groupIDs);
        // console.log(
        //   "uhduhuhuehudbdbfubybyeybdyhb77777777777777777777777777777777777" +
        //     groupIDs
        // );
        // console.log(groupIDs);
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
            senderName: senderName,
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
            accepted: true,
          })
        );
      });
      socket.on("droppedBeforAccepted", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        (receiverChatID = jsonData.receiverChatID), (type = jsonData.type);
        socket.to(receiverChatID).emit(
          "droppingTheCall",
          JSON.stringify({
            type: type,
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
            senderName: senderName,
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

      socket.on("update_profile_picture", (jsonData) => {
        jsonData = JSON.parse(jsonData);
        dataToSend = JSON.stringify({
          profilePicture: jsonData.profilePicture,
          id: jsonData.id,
          userType: jsonData.userType,
        });
        for (let i = 0; i < jsonData.receivers.length; i++)
          socket
            .to(jsonData.receivers[i])
            .emit("profile_picture_updated", dataToSend);
      });

      // socket.on("book_meet", (meetData) => {
      //   socket.to(JSON.parse(meetData).volunteer).emit("booked_meet", meetData);
      // });

      socket.on("added_new_friend", (jsonData) => {
        friendData = JSON.parse(jsonData);
        friendID = friendData.friendID;
        console.log("qqqqqqqqqqqqqqqqqq" + friendID);
        socket.to(friendID).emit(
          "new_friend_added",
          JSON.stringify({
            _id: friendData._id,
            phoneNumber: friendData.phoneNumber,
            firstName: friendData.firstName,
            lastName: friendData.lastName,
            profilePicture: friendData.profilePicture,
          })
        );
      });

      socket.on("added_new_volunteer", (jsonData) => {
        volunteerData = JSON.parse(jsonData);
        volunteerID = volunteerData.volunteerID;
        socket.to(volunteerID).emit(
          "new_volunteer_added",
          JSON.stringify({
            _id: volunteerData._id,
            phoneNumber: volunteerData.phoneNumber,
            firstName: volunteerData.firstName,
            lastName: volunteerData.lastName,
            profilePicture: volunteerData.profilePicture,
          })
        );
      });

      socket.on("book_meet", (meetData, callback) => {
        const { volunteer, slot, timeOfDay } = JSON.parse(meetData);
        if (
          volunteerSlots.isSlotPresent(
            volunteer,
            timeOfDay.split(".")[1].toLowerCase(),
            slot
          )
        ) {
          let updatedVolunteerSlots =
            volunteerSlots.getVolunteerSlots(volunteer);
          updatedVolunteerSlots[timeOfDay.split(".")[1].toLowerCase()] =
            updatedVolunteerSlots[timeOfDay.split(".")[1].toLowerCase()].filter(
              (s) => s != slot
            );
          volunteerSlots.updateVolunteerSlots(volunteer, updatedVolunteerSlots);
          if (onlineuser[volunteer]) {
            socket.to(volunteer).emit("booked_meet", meetData);
          } else {
            if (pendingMeetBookingNotifications.hasOwnProperty(volunteer)) {
              pendingMeetBookingNotifications[volunteer] = [
                ...pendingMeetBookingNotifications[volunteer],
                meetData,
              ];
            } else {
              pendingMeetBookingNotifications[volunteer] = [meetData];
            }
          }
          callback({
            status: "booked",
          });
        } else {
          callback({
            status: "failed",
          });
        }
      });

      socket.on("request_meet", (meetData) => {
        meetData = JSON.parse(meetData);
        // console.log(meetData.volunteerIds);
        meetData.volunteerIds.forEach((e) => {
          // console.log(e)
          socket.to(e).emit("requested_meet", meetData.elderName);
        });
      });

      socket.on("accept_meet", (meetData, callback) => {
        const { elderId, meetId } = JSON.parse(meetData);
        if (elderSlots.isSlotPresent(meetId)) {
          elderSlots.removeSlot(meetId);
          if (onlineuser[elderId]) {
            socket.to(elderId).emit("meet_accepted", meetData);
          } else {
            if (pendingMeetAcceptanceNotifications.hasOwnProperty(elderId)) {
              pendingMeetAcceptanceNotifications[elderId] = [
                ...pendingMeetAcceptanceNotifications[elderId],
                meetData,
              ];
            } else {
              pendingMeetAcceptanceNotifications[elderId] = [meetData];
            }
          }
          callback({
            status: "success",
          });
        } else {
          callback({
            status: "failed",
          });
        }
      });

      //Send message to only a particular user
      socket.on("send_message", (messageData) => {
        const withTimeout = (onSuccess, onTimeout, timeout) => {
          let called = false;

          const timer = setTimeout(() => {
            if (called) return;
            called = true;
            onTimeout();
          }, timeout);

          return (...args) => {
            if (called) return;
            called = true;
            clearTimeout(timer);
            onSuccess.apply(this, args);
          };
        };

        messageData = JSON.parse(messageData);
        timestamp = messageData.timestamp;
        message = messageData.text;
        senderChatID = messageData.senderChatID;
        receiverChatID = messageData.receiverChatID;
        memberChatIDs = messageData.memberChatIDs;
        senderName =
          messageData.senderFirstName + " " + messageData.senderLastName;
        console.log(memberChatIDs);
        if (memberChatIDs.length == 0) {
          console.log("SINGLE CHAT");
          if (onlineuser[receiverChatID]) {
            console.log(receiverChatID);
            io.sockets.sockets[onlineuser[receiverChatID]].emit(
              "receive_message",
              JSON.stringify({
                timestamp: timestamp,
                message: message,
                senderChatID: senderChatID,
                receiverChatID: receiverChatID,
                senderName: senderName,
              }),
              withTimeout(
                () => {
                  console.log("success!");
                },
                () => {
                  console.log("err");
                  if (offlineMsgs.hasOwnProperty(receiverChatID)) {
                    offlineMsgs[receiverChatID] = [
                      ...offlineMsgs[receiverChatID],
                      {
                        timestamp: timestamp,
                        message: message,
                        senderChatID: senderChatID,
                        receiverChatID: receiverChatID,
                        senderName: senderName,
                      },
                    ];
                  } else {
                    offlineMsgs[receiverChatID] = [
                      {
                        timestamp: timestamp,
                        message: message,
                        senderChatID: senderChatID,
                        receiverChatID: receiverChatID,
                        senderName: senderName,
                      },
                    ];
                  }
                },
                1000
              )
            );
          } else {
            if (offlineMsgs.hasOwnProperty(receiverChatID)) {
              offlineMsgs[receiverChatID] = [
                ...offlineMsgs[receiverChatID],
                {
                  timestamp: timestamp,
                  message: message,
                  senderChatID: senderChatID,
                  receiverChatID: receiverChatID,
                  senderName: senderName,
                },
              ];
            } else {
              offlineMsgs[receiverChatID] = [
                {
                  timestamp: timestamp,
                  message: message,
                  senderChatID: senderChatID,
                  receiverChatID: receiverChatID,
                  senderName: senderName,
                },
              ];
            }
          }
        } else {
          console.log("GROUP CHAT");
          memberChatIDs.forEach((m) => {
            console.log("RECCCCCCC" + m);
            if (onlineuser[m]) {
              socket.to(m).emit(
                "receive_message",
                JSON.stringify({
                  timestamp: timestamp,
                  message: message,
                  senderChatID: senderChatID,
                  receiverChatID: receiverChatID,
                  senderName: senderName,
                })
              );
            } else {
              if (offlineMsgs.hasOwnProperty(m)) {
                offlineMsgs[m] = [
                  ...offlineMsgs[m],
                  {
                    timestamp: timestamp,
                    message: message,
                    senderChatID: senderChatID,
                    receiverChatID: receiverChatID,
                    senderName: senderName,
                  },
                ];
              } else {
                offlineMsgs[m] = [
                  {
                    timestamp: timestamp,
                    message: message,
                    senderChatID: senderChatID,
                    receiverChatID: receiverChatID,
                    senderName: senderName,
                  },
                ];
              }
            }
          });
        }
        // console.log(receiverChatID);
        //Send message to only that particular room
        // socket.broadcast.emit("test", "test");
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
              groupName: groupName,
              _id: _id,
              memberChatIDs: memberChatIDs,
              creatorChatID: creatorChatID,
            })
          );
        });
      });
      console.log(`Connected: ${socket.id}`);
      socket.on("disconnect", () => {
        Object.keys(onlineuser).forEach((e) => {
          if (onlineuser[e] === socket.id) delete onlineuser[e];
        });
        // onlineuser = Object.keys(onlineuser).filter((id) => (onlineuser[id] = socket.id));
        console.log(`Disconnected: ${socket.id}`);
        // socket.emit("checkOnlineUser")
        socket.broadcast.emit("checkOnlineUser", "hello friends!");
        console.log("wwwwwwwwwwwwwwwwwww");
      });
      // socket.on("offline", (jsonData) => {
      //   jsonData = JSON.parse(jsonData)
      //   console.log(jsonData.friendIDS);
      //   onlineuser = onlineuser.filter(id => id != jsonData.chatID)
      //   jsonData.friendIDs.forEach(e => {
      //     socket.to(e).emit("goneOffline", JSON.stringify({
      //       _id: jsonData.chatID,
      //     }))
      //   })
      // });
    });
  })
  .catch((err) => console.log(err));
