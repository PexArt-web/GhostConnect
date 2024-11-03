const signup = require("../Models/Auth/signupMethod");
const login = require("../Models/Auth/loginMethod");

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await signup(username, email, password);
    res
      .status(200)
      .json({ message: user.username + "now created", info: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await login(username, email, password);
    res
      .status(200)
      .json({ message: `user ${user.username} ${user.email} ${user}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
