const { log } = console;
let totalConnections = new Set();
function onConnect(socket, io) {
  //<--Total active connections -->
  io.emit("clients-total", totalConnections);
  totalConnections.add(socket.id);
  log("total connections :" + totalConnections);
  socket.on("disconnect", () => {
    totalConnections.delete(socket.id);
  });
}
module.exports = { onConnect };
