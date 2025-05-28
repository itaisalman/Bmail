const labels = require("../models/labels");

exports.getAllLabels = (req, res) => {
  const user_id = parseInt(req.headers["user"]);
  if (!user_id) {
    return res.status(404).json({ error: "User not found" });
  }
  const userLabels = labels.getAllLabels(user_id);
  res.json(userLabels);
};
