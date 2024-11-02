const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const saltRound = process.env.SALT_ROUND;
const MaxAttempts = 3;
const lockTimeOut = 30 * 60 * 1000; // 30 minutes lockOut

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
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
      select: false,
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

// static methods for login and signup

// signup method

userSchema.statics.signup = async function (username, email, password) {
  try {
    if (!username || !email || !password) {
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
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({
      email: email,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

// login method

userSchema.statics.login = async function (username, email, password) {
  try {
    if ((!username && !email) || !password) {
      throw Error("All fields are required");
    }
    const existingUser = await this.findOne({ email });
    if (!existingUser) {
      throw Error("Invalid username or password");
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
        throw Error("Too many failed login attempts. Please try again later.");
      }
      existingUser.loginAttempts += 1;
      await existingUser.save();
      throw Error("Invalid password");
    }
    existingUser.loginAttempts = 0;
    existingUser.lockUntil = null;
    await existingUser.save();
    return existingUser;
  } catch (error) {
    throw error;
  }
};
