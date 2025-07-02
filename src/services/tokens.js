const userService = require("./users");

// Find user based on username and password from User schema
const findUserByUsernameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user) return null;

  if (user.password === password) {
    return user;
  }

  return null;
};

module.exports = {
  findUserByUsernameAndPassword,
};
