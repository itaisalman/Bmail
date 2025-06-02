const users = require("./users");

// Find user based on username and password from users array
const findUserByUsernameAndPassword = (username, password) => {
  return users
    .getAllUsers()
    .find((u) => u.username === username && u.password === password);
};

module.exports = {
  findUserByUsernameAndPassword,
};
