const { log } = console;
let userID = {};
let users = {};

//<-- users Info ()-->
function emitActiveUsersDetails(io) {
  //<--Active Users count & User List  -->
  const activeUser = Object.keys(users).length;
  const userRegistry = { userCount: activeUser, userList: users };
  io.emit("userRecords", userRegistry);
}

const confirmUser = (socket) => {
  const checkUserID = Object.keys(userID).find(
    (key) => userID[key] === socket.id
  );
  return checkUserID;
};
//<--Join Room -->
function joinRoom(socket, roomName) {
  if (!roomName || typeof roomName !== "string") {
    log("Invalid room name");
    return;
  }

  const checkUser = confirmUser(socket);
  if (checkUser) {
    const username = users[checkUser];
    socket.join(roomName);
    socket.emit(
      "alertToSelf",
      `You’ve joined ${roomName}! Let the conversations begin!`
    );

    socket
      .to(roomName)
      .emit("roomAlert", `${username} has just joined ${roomName}! Say hi!`);
  }
}
//
// <-- Leave Room -->
function leaveRoom(socket, roomName) {
  const checkUser = confirmUser(socket);
  if (checkUser) {
    const username = users[checkUser];
    socket.leave(roomName);
    socket.to(roomName).emit("roomAlert", `${username} left`);
  }
}
//
function connectSocket(socket, io) {
  // saving each userID
  socket.on("userDetails", ({ id, username }) => {
    userID[id] = socket.id;
    users[id] = username;
    //<--Active Users count & User List  -->
    emitActiveUsersDetails(io);
  });

  //<--Join Ghost Connect Chat -->
  socket.on("joinRoom", (roomName) => {
    joinRoom(socket, roomName);
  });
  //
  //<--send & receive messages -->
  //receiveMessage
  socket.on("roomMessage", ({ roomName, messageData }) => {
    io.in(roomName).emit("newMessage", messageData);
    log(messageData, "receiveMessage");
  });
  //

  //<--leave Ghost Connect Chat -->
  socket.on("leaveRoom", (roomName) => {
    leaveRoom(socket, roomName);
  });
  //

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
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
}

module.exports = { connectSocket };
