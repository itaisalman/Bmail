const jwt = require("jsonwebtoken");
const users = require("../models/users");

// Middleware to authenticate incoming requests using a JWT token.
const isLoggedIn = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const token = jwt.verify(token, process.env.TOKEN);
      if (users.getUserById(token.id)) {
        req.headers["user"] = token.id;
        return next();
      }
    } catch (err) {
      return res.status(401).json({ err });
    }
  } else return res.status(403).json({ error: "Token required" });
};

module.exports = {
  isLoggedIn,
};
