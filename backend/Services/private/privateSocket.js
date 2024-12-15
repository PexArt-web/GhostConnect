const { log } = console;
let userID = {};
let users = {};
function emitActiveUsersDetails(io) {
  //<--Active Users count & User List  -->
  const activeUser = Object.keys(users).length;
  const userRegistry = { userCount: activeUser, userList: users };
  log(activeUser, "active");
  io.emit("userRecords", userRegistry);
}
const privateChats = (socket, io) => {
  socket.on("userDetails", ({ id, username }) => {
    userID[id] = socket.id;
    users[id] = username;
    //<--Active Users count & User List  -->
    emitActiveUsersDetails(io);
  });

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    log("Disconnected");
    const removeUserId = Object.keys(userID).find(
      (index) => userID[index] === socket.id
    );

    if (removeUserId) {
      delete users[removeUserId];
      delete userID[removeUserId];
      //<--Active Users count & User List  -->
      emitActiveUsersDetails(io);
    }
  });
};

module.exports = { privateChats };
