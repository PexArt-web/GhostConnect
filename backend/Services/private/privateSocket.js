const pc = require("../../Models/Blueprint/privateChatModel");

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

  socket.on("sendMessage", async ({ content, recipientId, senderID }) => {
    const messageData = new pc({
      content,
      recipientId,
      senderID,
    });
    const saveToDatabase = await messageData.save();
    if (!saveToDatabase) return;
    const recipientSocket = userID[recipientId];
    if(recipientSocket){
      io.to(recipientSocket).emit("newPrivateMessage", saveToDatabase);
    }else{  
      console.log('User not found');
      // socket.emit('error', 'User not found');
      return;
    }
   
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
