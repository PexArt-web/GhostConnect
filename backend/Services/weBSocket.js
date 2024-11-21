const { log } = console;
let userID = {};
let users = {};

function connectSocket(socket, io) {
  // saving each userID
  socket.on("userDetails", ({ id, username }) => {
    userID[id] = socket.id;
    users[id] = username;
    //<--Active Users count & User List  -->
    const activeUser = Object.keys(users).length;
    const userRegistry = { userCount: activeUser, userList: users };
    io.emit("userRecords", userRegistry);
  });
 

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    const removeUserId = Object.keys(userID).find(
      (index) => userID[index] === socket.id
    );

    if (removeUserId) {
      delete users[removeUserId];
      delete userID[removeUserId];
     
      //<--Active Users count & User List  -->
      const activeUser = Object.keys(users).length;
      const userRegistry = { userCount: activeUser, userList: users };
      io.emit("userRecords", userRegistry);
    }
  });
}

module.exports = { connectSocket };
