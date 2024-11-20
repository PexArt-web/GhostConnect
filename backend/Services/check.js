const { log } = console;
let userIDMap = {}; // Maps userID to socket.id
let users = {}; // Maps userID to username

function connectSocket(socket, io) {
  // Handle user identification
  socket.on("userIdentifier", (id) => {
    userIDMap[id] = socket.id; // Map userID to socket.id
    log(`UserID mapped: ${id} -> ${socket.id}`);
  });

  // Handle username assignment
  socket.on("userName", (username) => {
    const userID = Object.keys(userIDMap).find((key) => userIDMap[key] === socket.id);

    if (userID) {
      users[userID] = username; // Map userID to username
      log(users, `Username assigned: ${username}`);

      // Emit active users count
      io.emit("activeUsers", Object.keys(users).length);
      log(`Active users: ${Object.keys(users).length}`);

      // Emit updated user list
      io.emit("userList", users);
    } else {
      log("userName event fired before userIdentifier mapping.");
    }
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    const userID = Object.keys(userIDMap).find((key) => userIDMap[key] === socket.id);

    if (userID) {
      delete users[userID]; // Remove user from the username map
      delete userIDMap[userID]; // Remove userID mapping
      io.emit("activeUsers", Object.keys(users).length); // Emit updated count
      io.emit("userList", users); // Emit updated user list
      log(`User disconnected: ${userID}`);
    }
  });
}

module.exports = { connectSocket };
