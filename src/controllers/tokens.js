const tokens = require("../models/tokens");
const jwt = require("jsonwebtoken");

exports.returnUserId = (req, res) => {
  // Extract username and password from body
  const { username, password } = req.body;

  // Check that arguments are given
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  // Check that email address and password are existed
  const user = tokens.findUserByUsernameAndPassword(
    username + "@bmail.com",
    password
  );

  // handle user not found
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }
  console.log(user.id);
  console.log(process.env.TOKEN);
  const token = jwt.sign({ id: user.id }, process.env.TOKEN);
  console.log(token);
  // return user id
  res.json({ token });
};
