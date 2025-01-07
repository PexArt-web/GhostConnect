const signup = require("../Models/Auth/signupMethod");
const login = require("../Models/Auth/loginMethod");
const jwt = require("jsonwebtoken");
const { log } = console;
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN_SECRET, { expiresIn: "3d" });
};
const signupUser = async (req, res) => {
  const { username, email, password, uniqueId } = req.body;
  try {
    const user = await signup(username, email, password, uniqueId);
    const token = createToken(user._id);
    res.status(200).json({ email: email, token: token ,ID: uniqueId });
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
      .json({ email: user.email, username: user.username, token: token , ID: user.uniqueID });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
