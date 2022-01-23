let io;

module.exports = {
  initServer: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://192.168.0.108",
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
