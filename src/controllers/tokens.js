const tokens = require("../services/tokens");
const jwt = require("jsonwebtoken");

exports.returnUserId = async (req, res) => {
  // Extract username and password from body
  const { username, password } = req.body;

  // Check that arguments are given
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    // Check that email address and password are existed
    const email = username.endsWith("@bmail.com")
      ? username
      : username + "@bmail.com";

    const user = await tokens.findUserByUsernameAndPassword(email, password);

    // handle user not found
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.TOKEN);
    // return user id
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Error generating token:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
