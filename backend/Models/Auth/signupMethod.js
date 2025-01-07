const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../Blueprint/userModel");
const saltRound = parseInt(process.env.SALT_ROUND);
const { log } = console;
const signup = async (username, email, password, uniqueId) => {
  try {
    if (!username || !email || !password || !uniqueId) {
      throw Error("All fields are required");
    }
    if (!validator.isEmail(email)) {
      throw Error("Please provide a valid email");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error(
        "Password must be strong (at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character)"
      );
    }
    // Database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      uniqueID: uniqueId,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = signup;
