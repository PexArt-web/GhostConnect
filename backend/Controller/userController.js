const signup = require("../Models/Auth/signupMethod");
const login = require("../Models/Auth/loginMethod");
const jwt = require("jsonwebtoken");
const User = require("../Models/Blueprint/userModel");
const { log } = console;
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN_SECRET, { expiresIn: "3d" });
};
const signupUser = async (req, res) => {
  const { username, email, password, uniqueId } = req.body;
  try {
    const user = await signup(username, email, password, uniqueId);
    const token = createToken(user._id);
    res.status(200).json({ email: email, token: token, ID: uniqueId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await login(username, email, password);
    const token = createToken(user._id);
    res
      .status(200)
      .json({
        email: user.email,
        username: user.username,
        token: token,
        ID: user.uniqueID,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const friendRequestList = async (req, res) => {
  const { userId } = req.body;
  try {
    const friendRequestList = await User.find({
      uniqueID: "fba58610-7485-4887-9a75-4e07d3da1f44",
    }).select("friendRequestList");
    if (!friendRequestList) {
      throw Error("No friend requests found");
    }
    log(friendRequestList, "friendRequestList node");
    res.status(200).json(friendRequestList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const friendList = async (req, res) => {
  const { userId } = req.body;
  try {
    const friendList = await User.find({
      uniqueID: "fba58610-7485-4887-9a75-4e07d3da1f44",
    }).select("friendList");
    if (!friendList) {
      throw Error("No friends found");
    }
    log(friendList, "friendList node");
    res.status(200).json(friendList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  signupUser,
  loginUser,
  friendRequestList,
  friendList,
};
