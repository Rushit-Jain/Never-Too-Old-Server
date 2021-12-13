let io;

module.exports = {
  initServer: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
<<<<<<< HEAD
        origin: "http://192.168.0.112",
=======
        origin: "http://192.168.0.104",
>>>>>>> 22d0abbd56a78b9bcff66e42c5723b7cfd8c4432
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
