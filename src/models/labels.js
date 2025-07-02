const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Label = new Schema({
  name: {
    type: String,
    required: true,
  },
  mails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mail",
  },
});

module.exports = mongoose.model("Label", Label);
