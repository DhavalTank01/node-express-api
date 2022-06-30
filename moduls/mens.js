const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    required: true,
    trim: true,
  },
  ranking: {
    type: Number,
    min: 0,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    min: 0,
    type: Number,
    required: true,
    trim: true,
  },
  event: {
    type: String,
    required: true,
    default:"100m",
  },
});

const Mens100M = new mongoose.model("Mens100M", schema);

module.exports = Mens100M;
