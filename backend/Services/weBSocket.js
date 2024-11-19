// let connectedSocket = new Set()
const { log } = console;
let userID;
let users = {};

function connectSocket(socket, io) {
  // saving each userID
  socket.on("userIdentifier", (id) => {
    userID = id;
    log(id, "userID");
  });
  //using the ID as keys for each users usernames
  socket.on("userName", (username) => {
    users[userID] = username;
    log(users, "userName", username);
    //<--Active Users -->
    //emitting the number of active users to the frontend every time a new user joins or leaves the server
    io.emit("activeUsers", Object.keys(users).length);
    log(Object.keys(users).length, "length");
    //<--User List -->
    //emitting the whole user object to map username from frontend
    socket.emit("userList", users);
  });

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    const removeUserId = Object.keys(users).find((index) => index === userID);

    if (removeUserId) {
      delete users[removeUserId];
      io.emit("activeUsers", Object.keys(users).length);
      log(Object.keys(users).length, "activeUsers length");
      log(removeUserId, "left the server");

      //<--User List -->
      //emitting the whole user object to map username from frontend
      io.emit("userList", users);
    }
  });
}

module.exports = { connectSocket };
