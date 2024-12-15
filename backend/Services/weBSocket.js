const { groupServices } = require("./public/groupMessage");
const { privateChats } = require("./private/privateSocket");
function connectSocket(socket, io) {
  //<--Ghost Connect <<-- Group Chat -->>
  groupServices(socket, io);

  //<--Ghost Connect <<-- Private Chat -->>
  privateChats(socket, io);
  //
}

module.exports = { connectSocket };
