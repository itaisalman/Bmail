const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  theme: {
    type: String,
    default: "light",
  },
  received_mails: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  sent_mails: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  drafts: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  starred: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  important: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  spam: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  trash: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
  labels: {
    type: [Object], // temporary until mails schema creation
    default: [],
  },
});

module.exports = mongoose.model("User", User);
