const { default: mongoose } = require("mongoose");
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
    const senderSocket = userID[senderID];
    if (recipientSocket && senderSocket) {
      //<--Emit to the recipient side-->
      io.to(recipientSocket).emit("newPrivateMessage", saveToDatabase);
      //<--Emit to the sender side-->
      io.to(senderSocket).emit("newPrivateMessage", saveToDatabase);
    } else {
      console.log("receiver and sender not found");
      // socket.emit('error', 'User not found');
      return;
    }
  });
  //

  //<--update message -->
  socket.on(
    "updateMessage",
    async ({ _id, content, recipientID, senderID }) => {
      const recipientSocket = userID[recipientID];
      const senderSocket = userID[senderID];
      try {
        if (!mongoose.Types.ObjectId.isValid(_id)) return;
        const updateMessage = await pc.findByIdAndUpdate(
          _id,
          {
            $set: { content: content, edited: true },
          },
          { new: true }
        );
        if (!updateMessage) {
          log("error updating message");
          return;
        }
        if (!recipientSocket && !senderSocket) return;
        //<-- Emit to the recipient side -->
        io.to(recipientSocket).emit("updatedMessage", updateMessage);
        //<--Emit to the sender side-->
        io.to(senderSocket).emit("updatedMessage", updateMessage);
      } catch (error) {
        log(`Error updating message : ${error.message}`);
      }
    }
  );
  //

  //<--Delete message -->
  socket.on(
    "deleteTextMessage",
    async ({ deleteID, recipientId, senderID }) => {
      const recipientSocket = userID[recipientId];
      const senderSocket = userID[senderID];
      try {
        if (!mongoose.Types.ObjectId.isValid(deleteID)) return;
        const deleteMessage = await pc.findByIdAndDelete(deleteID);
        if (!deleteMessage) return;
        if (!recipientSocket && !senderSocket) return;
        //<-- emit to receiver side -- >
        io.to(recipientSocket).emit("messageDeleted", deleteMessage._id);
        //<-- emit to sender side -- >
        io.to(senderSocket).emit("messageDeleted", deleteMessage._id);
      } catch (error) {
        log(`Error deleting message : ${error.message}`);
      }
    }
  );
  //
  //<-- handle Input Focus and Blur events -->
  socket.on("inputFocus", ({ senderID, recipientID }) => {
    if (!senderID && recipientID) return;
    const username = users[senderID];
    const recipientSocket = userID[recipientID];
    //<-- emitting to the receivers side -->
    io.to(recipientSocket).emit("inputFocus", `${username} is typing ...`);
  });
  //
  socket.on("inputBlur", (recipientID)=>{
    const recipientSocket = userID[recipientID];
    io.to(recipientSocket).emit("inputBlur", null)
  })
  //

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    log("Disconnected");
    const removeUserId = Object.keys(userID).find(
      (index) => userID[index] === socket.id
    );
    const username = users[removeUserId]
    

    if (removeUserId) {
      delete users[removeUserId];
      delete userID[removeUserId];
      log(`${username} is offline`);
      //<--Active Users count & User List  -->
      emitActiveUsersDetails(io);
    }
  });
};

module.exports = { privateChats };
