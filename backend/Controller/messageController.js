const Message = require("../Models/Blueprint/messageModel");
const pc = require("../Models/Blueprint/privateChatModel");

const { log } = console;

const groupMessage = async (req, res) => {
  try {
    const getAllMessages = await Message.find().sort({ createdAt: 1 });
    if (!getAllMessages) {
      throw Error("No messages found");
    }
    res.status(200).json(getAllMessages);
  } catch (error) {
    res
      .status(500)
      .json(`Error fetching document from database: ${error.message}`);
  }
};

// <--private chats -->

const getChats = async (req, res) => {
  const { senderUiD, receiverUiD } = req.query;
  try {
    if (!senderUiD || !receiverUiD) return;
    const pChats = await pc.find({
      $or: [
        { senderID: senderUiD },
        { recipientID: senderUiD },
        { senderID: receiverUiD },
        { senderID: receiverUiD },
      ],
    });
    if (!pChats) return;
    res.status(200).json(pChats);
  } catch (error) {
    res
      .status(500)
      .json(`Error fetching document from database: ${error.message}`);
  }
};

module.exports = { groupMessage, getChats };
