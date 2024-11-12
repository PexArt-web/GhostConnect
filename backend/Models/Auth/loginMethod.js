const bcrypt = require("bcryptjs");
const User = require("../Blueprint/userModel");
const MaxAttempts = 3;
let maxTrial = 0;
const lockTimeOut = 30 * 60 * 1000; // 30 minutes lockOut
const { log } = console;

const login = async (username, email, password) => {
  try {
    if ((!username && !email) || !password) {
      throw Error("All fields are required");
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (!existingUser) {
      // remember to redirect users to the sign up page after max attempts
      if(maxTrial >= MaxAttempts){
        throw Error("Redirecting users to the sign up page");
      }
      maxTrial++;
      log(maxTrial, "redirecting users to the sign up page");
      throw Error("Account does not exist");
    }

    // check if user is locked

    if (existingUser.isLocked) {
      throw Error("Account is temporarily locked. Try again later.");
    }

    const bcryptPasswordCheck = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!bcryptPasswordCheck) {
      if (existingUser.loginAttempts >= MaxAttempts) {
        existingUser.lockUntil = Date.now() + lockTimeOut;
        throw Error(
          "Too many failed login attempts. Please try again after 30 min."
        );
      }
      existingUser.loginAttempts += 1;
      await existingUser.save();
      throw Error("Invalid password");
    }
    if (existingUser.loginAttempts >= MaxAttempts) {
      existingUser.lockUntil = Date.now() + lockTimeOut;
      throw Error(
        "Too many failed login attempts. Please try again after 30 min."
      );
    }
    existingUser.loginAttempts = 0;
    existingUser.lockUntil = null;
    await existingUser.save();
    return existingUser;
  } catch (error) {
    throw error;
  }
};

module.exports = login;
