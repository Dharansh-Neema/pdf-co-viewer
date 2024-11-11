socket.on("page-changed", (newPage) => {
  pageNum = newPage;
  renderPage(pageNum);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
  alert("Connection error. Please refresh the page.");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("reconnect", () => {
  if (currentDocumentId) {
    socket.emit("join-document", currentDocumentId);
  }
});
