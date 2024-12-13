const { log } = console;
const privateChats = (socket, io) => {
  socket.on("privateChat", (chat) => {
    log(chat, "privateChat");
  });
};

module.exports = { privateChats };
    