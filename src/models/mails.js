const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = new Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  sender_address: {
    type: String,
    required: true,
  },
  sender_first_name: {
    type: String,
    required: true,
  },
  sender_last_name: {
    type: String,
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiver_address: {
    type: String,
    required: true,
  },
  receiver_first_name: {
    type: String,
    required: true,
  },
  receiver_last_name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const DraftSchema = new Schema({
  receiver_address: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const Mail = mongoose.model("Mail", MailSchema);
const Draft = mongoose.model("Draft", DraftSchema);
module.exports = { Mail, Draft };
