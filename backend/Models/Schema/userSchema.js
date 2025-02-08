const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema(
  {
    uniqueID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  {
    friendList:{
      type: Array,
      default: [],
    }
  },
  {
    friendRequestList:{
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = userSchema;
