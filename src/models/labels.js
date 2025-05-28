let idCounter = 0;
const users = require("./users");

const getAllLabels = (user_id) => {
  const user = users.getUserById(user_id);
  if (!user) return null;
  return user.labels;
};

const createLabel = (user_id, name) => {
  const user = users.getUserById(user_id);
  if (!user) return null;
  const new_label = { id: ++idCounter, name };
  user.labels.push(new_label);
  return new_label;
};

module.exports = {
  getAllLabels,
  createLabel,
};
