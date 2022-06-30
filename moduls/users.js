const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid.");
      }
    },
  },
  dob: {
    type: Date,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

schema.methods.genrateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log("Error: ", error);
  }
};

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Users = new mongoose.model("Users", schema);

module.exports = Users;
