const users = require("./users");

const getAllLabels = (user_id) => {
  const user = users.getUserById(user_id);
  if (!user) return null;
  return user.labels;
};

module.exports = {
  getAllLabels,
};
