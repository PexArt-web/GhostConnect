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
    console.log(username, "username");
    usersList[socket.id] = username;
  });

  socket.on("disconnect", () => {
    totalConnections.delete(socket.id);
    delete usersList[socket.id];
  });
}
module.exports = { onConnect };
