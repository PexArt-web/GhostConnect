// const { joinRoom } = require("../weBSocket");

const { confirmUser } = require("../weBSocket");

const { log } = console
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
 const roomMessages =  (socket) => {
    socket.on("joinRoom", ({roomName, userID}) => {
        log(roomName, "newIDuser", userID);
        joinRoom(socket, roomName);
      });
};

module.exports = roomMessages;
