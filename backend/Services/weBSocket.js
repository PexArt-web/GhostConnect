const { log } = console;
let totalConnections = new Set();
let usersList = {};
function onConnect(socket, io) {
  //<--Total active connections -->
  io.emit("clients-total", totalConnections.size);
  totalConnections.add(socket.id);
  log("total connections :" + totalConnections.size);
  //<-- username updated -->
  socket.on("username", (username) => {
    usersList[socket.id] = username;
    io.emit("users-list", usersList);
  });

  socket.on("disconnect", () => {
    totalConnections.delete(socket.id);
    // update after delete
    io.emit("clients-total", totalConnections.size);
    delete usersList[socket.id];
    // update after delete
    io.emit("usersList", usersList);
  });
}
module.exports = { onConnect };
