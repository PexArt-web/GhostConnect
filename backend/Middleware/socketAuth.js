const jwt = require("jsonwebtoken");
const User = require("../Models/Blueprint/userModel");
const { log } = console;

const socketAuth = async (authorization) => {
  try {
    const token = authorization.split(" ")[1];
    const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);
    return await User.findOne({ _id }).select("_id");
  } catch (error) {
    log(`error verifying user: ${error.message}`);
  }
};

module.exports = socketAuth;
