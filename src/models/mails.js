const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = new Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const DraftSchema = new Schema({
  receiver_address: String,
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const Mail = mongoose.model("Mail", MailSchema);
const Draft = mongoose.model("Draft", DraftSchema);
module.exports = { Mail, Draft };
