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
    log(username, "username already");
    socket.join(roomName);
    socket.emit("alert", `You Joined the room ${roomName}`);
    socket.to(roomName).emit("roomAlert", `${username} has joined the room`);
  } else {
    log("user not found");
  }
}
//
// <-- Leave Room () -->
function leaveRoom(socket, roomName) {
  const checkUser = confirmUser(socket);
  if (checkUser) {
    const username = users[checkUser];
    log(username, "username already");
    socket.leave(roomName);
    socket.to(roomName).emit("roomAlert", `${username} left the room`);
  } else {
    log("user not found");
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
