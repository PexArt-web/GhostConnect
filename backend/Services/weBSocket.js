let socketConnected = new Set();

const onConnect = (socket) => {
  const activeConnections = socketConnected.size;
  console.log(
    `New socket connected, total active connections: ${activeConnections}`
  );
  //
  socketConnected.add(socket.id);

  socket.on("disconnect", () => {
    socketConnected.delete(socket.id);
    console.log(
      `Socket disconnected, total active connections: ${socket.size}`
    );
  });

  socket.on("group-message", (data)=>{
    socket.broadcast.emit("group-message", data)
  })
};

module.exports = { onConnect };
