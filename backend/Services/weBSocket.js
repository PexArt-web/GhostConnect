let socketConnected = new Set();

const onConnect = (socket) => {
  socketConnected.add(socket.id);
  // <-- Total active users -->
  const activeConnections = socketConnected.size;
  console.log(
    `New socket connected, total active connections: ${activeConnections}`
  );

  //<-- Emit total active connections -->
   socket.broadcast.emit("activeConnections", activeConnections)

  // // <-- socket disconnection -->
  // socket.on("disconnect", () => {
  //   socketConnected.delete(socket.id);
  //   console.log(
  //     `Socket disconnected, total active connections: ${socket.size}`
  //   );
  // });

  //<-- group-message socket -->
  socket.on("group-message", (data)=>{
    socket.broadcast.emit("group-message", data)
  })
};

module.exports = { onConnect };
