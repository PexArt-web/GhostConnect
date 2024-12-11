const mongoose = require("mongoose");
const Message = require("../Models/Blueprint/messageModel");

const { log } = console;
let userID = {};
let users = {};

//<-- users Info ()-->
function emitActiveUsersDetails(io) {
  //<--Active Users count & User List  -->
  const activeUser = Object.keys(users).length;
  const userRegistry = { userCount: activeUser, userList: users };
  log(activeUser, 'active')
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
    return;
  }

  const checkUser = confirmUser(socket);
  if (!checkUser) {
    return;
  }
  const username = users[checkUser];
  socket.join(roomName);
  socket.emit(
    "alertToSelf",
    `You've joined ${roomName}! Let the conversations begin!`
  );

  socket
    .to(roomName)
    .emit("roomAlert", `${username} has just joined ${roomName}! Say hi!`);
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
    log("id  + username", id, username);
  });

  //<--Join Ghost Connect Chat -->
  socket.on("joinRoom", (roomName) => {
    log(roomName, "new", socket.id);
    joinRoom(socket, roomName);
  });
  //
  //<--send & receive messages -->
  //receiveMessage
  socket.on("roomMessage", async ({ roomName, messageData }) => {
    const { sender, content, senderID } = messageData;
    const message = new Message({
      sender,
      content,
      senderID,
    });
    const saveMessageDataToDatabase = await message.save();
    if (!saveMessageDataToDatabase) {
      return;
    }
    io.in(roomName).emit("newMessage", saveMessageDataToDatabase);
  });
  //
  // <--Update message-->
  socket.on("updatedMessage", async ({ roomName, messageData }) => {
    const { messageID, message } = messageData;
    if (!mongoose.Types.ObjectId.isValid(messageID)) return;
    const updatedMessage = await Message.findByIdAndUpdate(
      messageID,
      {
        $set: { content: message, edited: true },
      },
      { new: true }
    );
    if (!updatedMessage) {
      return;
    }
    log("update", updatedMessage)
    io.in(roomName).emit("updateMessage", updatedMessage);
  });

  // <--Delete message-->
  socket.on("deleteMessage", async ({ roomName, deleteID }) => {
    if (!mongoose.Types.ObjectId.isValid(deleteID)) return;
    const deleteMessage = await Message.findByIdAndDelete(deleteID);
    // const deleteMessage = await Message.deleteMany({})
    if (!deleteMessage) {
      return;
    }
    io.in(roomName).emit("deletedMessage", deleteID);
  });
  //

  socket.on("focus", (data) => {
    socket.broadcast.emit("focus", data.message);
  });

  socket.on("blur", (data) => {
    io.to(data.roomName).emit("blur", data.message);
  });

  //<--leave Ghost Connect Chat -->
  socket.on("leaveRoom", (roomName) => {
    leaveRoom(socket, roomName);
  });
  //


  // private-chat

  socket.on("privateChat", (chat)=>{
    log(chat, "privateChat")
  })

  //<--Socket Disconnections-->
  socket.on("disconnect", () => {
    log("Disconnected")
    const removeUserId = Object.keys(userID).find(
      (index) => userID[index] === socket.id
    );

    if (removeUserId) {
      delete users[removeUserId];
      delete userID[removeUserId];
      //<--Active Users count & User List  -->
      emitActiveUsersDetails(io);
    }
    socket.on("leaveRoom", (roomName) => {
      leaveRoom(socket, roomName);
    });
  });
}

module.exports = { connectSocket };
