const { log } = console;
const privateChats = (socket) => {
  socket.on("privateChat", (chat) => {
    log(chat, "privateChat");
  });
};

module.exports = { privateChats };
    