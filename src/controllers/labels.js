const labels = require("../models/labels");

exports.getAllLabels = (req, res) => {
  const user_id = parseInt(req.headers["user"]);
  if (!user_id) {
    return res.status(404).json({ error: "Missing ID" });
  }
  const userLabels = labels.getAllLabels(user_id);
  if (!userLabels) {
    return res.status(404).json({ error: "User ID not found" });
  }
  res.json(userLabels);
};
