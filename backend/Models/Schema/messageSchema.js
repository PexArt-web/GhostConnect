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
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    edited:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = messageSchema;
