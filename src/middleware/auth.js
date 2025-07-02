const jwt = require("jsonwebtoken");
const userService = require("../services/users");

// Middleware to authenticate incoming requests using a JWT token.
const isLoggedIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const authHeaderToken = req.headers.authorization.split(" ")[1];
    try {
      const decodedToken = jwt.verify(authHeaderToken, process.env.TOKEN);

      const user = await userService.getUserById(decodedToken.id);
      if (user) {
        req.headers["user"] = decodedToken.id;
        return next();
      } else {
        return res.status(401).json({ error: "Invalid user ID" });
      }
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(403).json({ error: "Token required" });
  }
};

module.exports = {
  isLoggedIn,
};
