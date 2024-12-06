const Message = require("../Models/Blueprint/messageModel");

const { log } = console;
const groupMessage = async (req, res) => {
  try {
    const getAllMessages = await Message.find().sort({createdAt: -1})
    if(!getAllMessages){
        throw Error("No messages found")
    }
    res.status(200).json(getAllMessages);
  } catch (error) {
    log(`Error fetching document: ${error.message}`)
  }
};

module.exports = { groupMessage };
