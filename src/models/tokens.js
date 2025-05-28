const users = require("./users");

const findUserByUsernameAndPassword = (mail_address, password) => {
  return users
    .getAllUsers()
    .find((u) => u.mail_address === mail_address && u.password === password);
};

module.exports = {
  findUserByUsernameAndPassword,
};
