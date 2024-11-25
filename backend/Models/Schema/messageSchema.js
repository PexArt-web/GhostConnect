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
      // type: Schema.Types.Mixed, // to accept multiple || any data types
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
    dateTime:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = messageSchema;
