// let connectedSocket = new Set()
const { log } = console;
let userID = {};
let users = {};

function connectSocket(socket, io) {
  // saving each userID
  socket.on("userIdentifier", (id) => {
    userID[id] = socket.id;
    log(id, "userID");
  });
  //using the ID as keys for each users usernames
  socket.on("userName", (username) => {
    const findId = Object.keys(userID).find((key) => users[key] === socket.id);
    if (findId) {
      users[findId] = username;
      log(users, "userName", username);
      //<--Active Users -->
      //emitting the number of active users to the frontend every time a new user joins or leaves the server
      io.emit("activeUsers", Object.keys(users).length);
      log(Object.keys(users).length, "length");
      //<--User List -->
      //emitting the whole user object to map username from frontend
      io.emit("userList", users);
    }else{
      log("userName event fired before userIdentifier mapping.")
    }
  });

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    const removeUserId = Object.keys(userID).find((index) => userID[index] === socket.id);

    if (removeUserId) {
      delete users[removeUserId];
      delete userID[removeUserId];
      log(Object.keys(users).length, "activeUsers length");
      log(removeUserId, "left the server");
      //<--update activeUsers -->
      io.emit("activeUsers", Object.keys(users).length);
      //<--User List -->
      //emitting the whole user object to map username from frontend
      io.emit("userList", users);
    }
  });
}

module.exports = { connectSocket };
