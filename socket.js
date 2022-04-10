let io;

module.exports = {
  initServer: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "192.168.0.108:5000",
        // origin: "192.168.0.112:5000",
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
