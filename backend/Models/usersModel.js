const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const saltRound = 10;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: "Name can only contain letters and spaces",
      },
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

userSchema.statics.login = async function(username, email, password){
   try {
    if(!username && !email || !password){
        throw Error("All fields are required");
    }
   } catch (error) {
    throw error;
   }
}
