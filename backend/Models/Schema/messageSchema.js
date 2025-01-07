const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender:{
      type: String,
      required: true,
    },
    senderID:{
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // status: {
    //   type: String,
    //   enum: ["sent", "delivered", "read"],
    //   default: "sent",
    // },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    edited:{
      type: Boolean,
      default: false,
    },
    // user_id:{
    //   type: String,
    //   required: true,
    // }
  },
  {
    timestamps: true,
  }
);

module.exports = messageSchema;
