const socket = require("socket.io");
const Document = require("../models/Document");

const initializeSocket = (server) => {
  const io = socket(server);

  io.on("connection", (socket) => {
    socket.on("join-document", async (documentId) => {
      socket.join(documentId);
      const document = await Document.findById(documentId);
      socket.emit("init-page", document.currentPage);
    });

    socket.on("change-page", async (data) => {
      const { documentId, page, isAdmin } = data;
      if (isAdmin) {
        await Document.findByIdAndUpdate(documentId, { currentPage: page });
        io.to(documentId).emit("page-changed", page);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
