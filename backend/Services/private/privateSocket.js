const { default: mongoose } = require("mongoose");
const pc = require("../../Models/Blueprint/privateChatModel");
const User = require("../../Models/Blueprint/userModel");
// const socketAuth = require("../../Middleware/socketAuth");
const date = new Date();

const { log } = console;
let userID = {};
let users = {};
function emitActiveUsersDetails(io) {
  //<--Active Users count & User List  -->
  const activeUser = Object.keys(users).length;
  const userRegistry = { userCount: activeUser, userList: users };
  io.emit("userRecords", userRegistry);
}
// for disconnected users

function emitInActiveUsers(io) {
  const inActiveUser = Object.keys(users).length;
  const disconnectedUserRegistry = {
    userCount: inActiveUser,
    userList: users,
    status: "InActive",
  };
  io.emit("disconnectedUsers", disconnectedUserRegistry);
  console.log(disconnectedUserRegistry, "query disconnected users");
}

const privateChats = (socket, io) => {
  socket.on("userDetails", ({ id, username }) => {
    userID[id] = socket.id;
    users[id] = username;
    //<--Active Users count & User List  -->
    emitActiveUsersDetails(io);
  });

  socket.on(
    "sendMessage",
    async ({ content, recipientId, senderID, authorization }) => {
      // const user_id = await socketAuth(authorization)
      // if(!user_id) return
      // log(user_id, "uuid")

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
        log("receiver and sender not found");
        // socket.emit('error', 'User not found');
        return;
      }
    }
  );
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
        if (updateMessage) {
          if (!recipientSocket && !senderSocket) return;
          //<-- Emit to the recipient side -->
          io.to(recipientSocket).emit("updatedMessage", updateMessage);
          //<--Emit to the sender side-->
          io.to(senderSocket).emit("updatedMessage", updateMessage);
        }
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
        // const deleteMessage = await pc.deleteMany({})
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
  socket.on("inputBlur", (recipientID) => {
    const recipientSocket = userID[recipientID];
    io.to(recipientSocket).emit("inputBlur", null);
  });
  //

  //<--Friend Request Operations-->
  socket.on("sendFriendRequest", async ({ id, username, requestedUserId }) => {
    log(id, username + " friend request");
    const recipientSocket = userID[id];
    if (!recipientSocket) return;
    const requestedUserUsername = users[requestedUserId];
    log(requestedUserUsername, "requestedUserUsername");
    try {
      const FriendRequestList = {
        id: requestedUserId,
        username: requestedUserUsername,
      };
      const saveToDatabase = await User.findOneAndUpdate(
        { uniqueID: id },
        { $push: { friendRequestList: FriendRequestList } }
      );
      if (saveToDatabase) {
        log("friendRequestList saved to database");
      }
      if (!saveToDatabase) return;
    } catch (error) {
      log(error + error.message, " error saving friend request");
    }
    io.to(recipientSocket).emit("friendRequest", {
      requestedUserId,
      requestedUserUsername,
    });
  });

  //<--accept FriendRequest-->
  socket.on("acceptFriendRequest", async ({ id, requestedUserId }) => {
    const recipientSocket = userID[id];
    const username = users[id]
    const senderSocket = userID[requestedUserId]
    const requestedUserUsername = users[requestedUserId];
    
    if (!recipientSocket) return;
    if(!senderSocket) return;
    if (!requestedUserUsername) return;
    try {
      const acceptFriendRequest = await User.findOneAndUpdate(
        { uniqueID: id },
        {
          $push: {
            friendList: {
              uniqueID: requestedUserId,
              username: requestedUserUsername,
            },
          },
        }
      );
      const updateRequestIdFriendList = await User.findByIdAndUpdate(
        { uniqueID: requestedUserId },
        {
          $push: {
            friendList: { uniqueID: id, username: requestedUserUsername },
          },
        }
      );
      if (!acceptFriendRequest || !updateRequestIdFriendList) {
        log(`Error! unable to accept request ${error.message}`);
        return;
      }
   
      io.to(recipientSocket).emit("friendRequestAccepted", {
        id: requestedUserId,
        username: requestedUserUsername,
      });
      io.to(senderSocket).emit("friendRequestAccepted", {
        id: id,
        username: username,
      });
      log(`${requestedUserUsername} has accepted ${username}'s friend request`);
    } catch (error) {
      log(`Error! unable to accept request ${error.message}`);
    }
  });
  /////////////////////////////

  //<--Friend Request Operation Ends Here-->

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    log("Disconnected");
    const removeUserId = Object.keys(userID).find(
      (index) => userID[index] === socket.id
    );
    // const removeActivity =
    const username = users[removeUserId];
    const date = new Date();
    if (removeUserId) {
      delete users[removeUserId];
      delete userID[removeUserId];
      // io.emit("lastSeen", { username, lastSeen: date.toUTCString() });
      log(`${username} is offline at ${date.toUTCString()}`);
      //<--Active Users count & User List  -->
      emitInActiveUsers(io);
      emitActiveUsersDetails(io);
    }
  });
};

module.exports = { privateChats };
