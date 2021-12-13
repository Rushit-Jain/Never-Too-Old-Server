let io;

module.exports = {
  initServer: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
<<<<<<< HEAD
<<<<<<< HEAD
        origin: "http://192.168.0.112",
=======
        origin: "http://192.168.0.104",
>>>>>>> 22d0abbd56a78b9bcff66e42c5723b7cfd8c4432
=======
        origin: "http://192.168.0.112",
>>>>>>> a754986e56422666a21514014042778299d6e911
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket io not initialized");
    return io;
  },
};
