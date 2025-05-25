const Label = require("../models/labels");

exports.getAllLabels = (req, res) => {
  res.json(Label.getAllLabels());
};
