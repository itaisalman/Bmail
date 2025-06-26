let idCounter = 0;
const users = require("./users");

const DEFAULT_LABEL_NAMES = [
  "inbox",
  "starred",
  "star",
  "important",
  "sent",
  "drafts",
  "draft",
  "trash",
  "spam",
  "labels",
];

// A helper function that checks before updating or creating
//  whether a label with the same name already exists.
const isDuplicateLabelName = (labels, name, ignoreId = null) => {
  const update_name = name.toLowerCase().trim();
  if (DEFAULT_LABEL_NAMES.includes(update_name)) return true;

  return labels.some(
    (label) =>
      label.name.toLowerCase().trim() === update_name && label.id !== ignoreId
  );
};

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

  // Check if a label with the same name already exists
  if (isDuplicateLabelName(user.labels, name)) return undefined;

  const new_label = { id: ++idCounter, name, mails: [] };
  user.labels.push(new_label);
  return new_label;
};

const updateLabel = (user_id, label_id, name) => {
  const user = users.getUserById(user_id);
  if (!user) return null;

  if (isDuplicateLabelName(user.labels, name, label_id)) return "conflict";

  // Find the label you want to update
  const label = user.labels.find((label) => label.id === label_id);
  if (!label) return undefined;

  label.name = name.trim();
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
  user.labels.splice(label_index, 1);
  return true;
};

module.exports = {
  getAllLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
};
