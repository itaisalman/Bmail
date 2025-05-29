let idCounter = 0;
const users = require("./users");

const getAllLabels = (user_id) => {
  const user = users.getUserById(user_id);
  if (!user) return null;
  return user.labels;
};

const getLabel = (user_id, label_id) => {
  // Trying to find the user by ID
  const user = users.getUserById(user_id);
  // If the user does not exist return null
  if (!user) return null;
  // If the user exists search for the label by ID,
  // If no such label is found, the function will return undefined.
  return user.labels.find((label) => label.id === label_id);
};

const createLabel = (user_id, name) => {
  const user = users.getUserById(user_id);
  if (!user) return null;
  const new_label = { id: ++idCounter, name };
  user.labels.push(new_label);
  return new_label;
};

const updateLabel = (user_id, label_id, update_name) => {
  const user = users.getUserById(user_id);
  if (!user) return null;

  const label = user.labels.find((label) => label.id === label_id);
  if (!label) return undefined;

  // Update the label by merging the values ​​from update_name
  Object.assign(label, update_name);
  return label;
};

const deleteLabel = (user_id, label_id) => {
  const user = users.getUserById(user_id);
  if (!user) return null;

  // Search for the label index in the user's label array
  const label_index = user.labels.findIndex((label) => label.id === label_id);
  // Label does not exist return undefined
  if (label_index === -1) return undefined;

  // Remove from array by index
  user.labels.splice(label, 1);
  return true;
};

module.exports = {
  getAllLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
};
