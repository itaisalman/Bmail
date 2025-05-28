const tokens = require("../models/tokens");

exports.returnUserId = (req, res) => {
  const { mail_address, password } = req.body;

  if (!mail_address || !password) {
    return res.status(400).json({ error: "Missing mail_address or password" });
  }

  const user = tokens.findUserByUsernameAndPassword(mail_address, password);

  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }

  res.json({ id: user.id });
};
