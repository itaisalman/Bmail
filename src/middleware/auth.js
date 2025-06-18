const jwt = require("jsonwebtoken");
const users = require("../models/users");

// Middleware to authenticate incoming requests using a JWT token.
const isLoggedIn = (req, res, next) => {
  if (req.headers.authorization) {
    const authHeaderToken = req.headers.authorization.split(" ")[1];
    try {
      const decodedToken = jwt.verify(authHeaderToken, process.env.TOKEN);
      if (users.getUserById(decodedToken.id)) {
        req.headers["user"] = decodedToken.id;
        return next();
      } else {
        return res.status(401).json({ error: "Invalid user ID" });
      }
    } catch (err) {
      return res.status(401).json({ err });
    }
  } else return res.status(403).json({ error: "Token required" });
};

module.exports = {
  isLoggedIn,
};
