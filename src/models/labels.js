let idCounter = 0;
const users = require("./users");
const mails = require("./mails");

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

  if (!update_name) return true;

  if (DEFAULT_LABEL_NAMES.includes(update_name)) return true;

  return labels.some((label) => {
    // If this is an update – ignore the current label
    if (Number(label.id) === Number(ignoreId)) return false;

    const currentName = label.name.toLowerCase().trim();
    const sameName = currentName === update_name;

    return sameName;
  });
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

  // Find the label you want to update
  const label = user.labels.find((label) => label.id === label_id);
  if (!label) return undefined;

  if (isDuplicateLabelName(user.labels, name, label_id)) return "conflict";

  label.name = name.trim();
  return label;
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

const removeMail = (labelId, mailId, userId) => {
  const user = users.getUserById(userId);

  const label = user.labels.find((lbl) => lbl.id === Number(labelId));
  if (!label) return false;

  const originalLength = label.mails.length;
  label.mails = label.mails.filter((m) => m.id !== mailId);

  return label.mails.length !== originalLength;
};

const getMailLabels = (user, mailId) => {
  let return_labels = [];
  for (const label of user.labels) {
    if (label.find((mail) => mail.id === mailId)) {
      return_labels.push(label);
    }
  }
  return return_labels;
};

const getSpecificMailLabels = (user_id, mail_id) => {
  const user = users.getUserById(user_id);
  if (!user) return null;

  const mail = mails.getSpecificMail(user_id, mail_id);
  if (!mail) return null;

  const user_labels = [];
  for (const label of user.labels) {
    if (label.mails.find((m) => m.id === mail_id)) {
      user_labels.push(label);
    }
  }
  return user_labels;
};

module.exports = {
  getAllLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
  removeMail,
  getMailLabels,
  getSpecificMailLabels,
};
