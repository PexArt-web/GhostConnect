const { log } = console;
let totalConnections = new Set();
function onConnect(socket, io) {
  //<--Total active connections -->
  io.emit("clients-total", totalConnections.size);
  totalConnections.add(socket.id);
  log("total connections :" + totalConnections.size);
  socket.on("disconnect", () => {
    totalConnections.delete(socket.id);
  });
}
module.exports = { onConnect };
