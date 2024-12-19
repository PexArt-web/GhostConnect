const Message = require("../../Models/Blueprint/messageModel");
const mongoose = require("mongoose");

const { log } = console;

let groupID = {};
let groupUsers = {};
let roomName;

function emitActiveGroupUsers(io) {
  const activeGroupUsers = Object.keys(groupUsers).length;
  const groupRegistry = {
    groupUsersCount: activeGroupUsers,
    groupUsersList: groupUsers,
  };
  io.emit("groupRecords", groupRegistry);
}
function confirmGroupUser(socket) {
  const checkUser = Object.keys(groupID).find(
    (key) => groupID[key] === socket.id
  );
  return checkUser;
}
function groupServices(socket, io) {
  // <-- Handle group user details
  socket.on("groupUserDetails", ({ id, username }) => {
    if (!id || !username) {
      return;
    }

    groupID[id] = socket.id;
    groupUsers[id] = username;
    emitActiveGroupUsers(io);
  });

  // <-- Handle room joining
  socket.on("joinRoom", (roomName) => {
    if (!roomName || typeof roomName !== "string") {
      return;
    }
    roomName = roomName;

    const confirmUser = confirmGroupUser(socket);
    if (!confirmUser) {
      return;
    }
    const username = groupUsers[confirmUser];

    socket.join(roomName);

    // notify self on room join
    socket.emit(
      "alertToSelf",
      `You've joined ${roomName}! Let the conversations begin!`
    );

    // notify others in the room
    socket
      .to(roomName)
      .emit("roomAlert", `${username} has just joined ${roomName}! Say hi!`);
  });

  // Handle room Messaging
  //<--send & receive messages -->
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

  //Message Update
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
    io.in(roomName).emit("updateMessage", updatedMessage);
  });
  //

  //<--Handle Message Delete
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

  //Handle Message Input Events
  socket.on("focus", (data) => {
    socket.broadcast.emit("focus", data.message);
  });

  socket.on("blur", (data) => {
    io.to(data.roomName).emit("blur", data.message);
  });
  //

  //Handle room leaving
  socket.on("leaveRoom", (roomName) => {
    const checkUser = confirmGroupUser(socket);
    if (checkUser) {
      const username = groupUsers[checkUser];
      socket.leave(roomName);
      socket.to(roomName).emit("roomAlert", `${username} left`);
    }
  });
  //
  //
  socket.on("disconnect", () => {
    const confirmUser = confirmGroupUser(socket);
    if (!confirmUser) {
      return;
    }
    const username = groupUsers[confirmUser];
    delete groupID[confirmUser];
    delete groupUsers[confirmUser];
    emitActiveGroupUsers(io);
    
    //notify users in the group
    socket.to(roomName).emit("leftRoom",`${username} has left the group`);
  });
}

module.exports = { groupServices };
