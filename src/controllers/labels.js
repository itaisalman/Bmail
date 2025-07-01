const users = require("../models/users");
const labels = require("../models/labels");

// Checks if the id given is valid
function isValidId(user_id) {
  return /^\d+$/.test(user_id);
}

function isValidName(name, res) {
  // Check if name was not defined at all
  if (name === undefined || name === null) {
    return { status: 400, message: "Name is required" };
  }
  // Convert to string and remove spaces from beginning and end
  const update_name = String(name).trim();
  if (update_name === "") {
    return { status: 400, message: "Name is required" };
  }
  // Check if the length exceeds the limit
  if (update_name.length > 225) {
    return { status: 400, message: "Name is too long" };
  }
  return null;
}

const getValidatedUserId = (req, res) => {
  // Extract the user ID from the headers
  const user_id = req.headers["user"];
  if (!isValidId(user_id)) {
    res.status(400).json({ error: "Missing/Invalid user ID" });
    return null;
  }
  // If the user's id is valid
  return Number(user_id);
};

exports.getAllLabels = (req, res) => {
  const user_id = getValidatedUserId(req, res);
  if (user_id === null) return;
  // Gets all the user's labels by ID
  const userLabels = labels.getAllLabels(user_id);
  if (!userLabels) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(userLabels);
};

exports.getLabelById = (req, res) => {
  const user_id = getValidatedUserId(req, res);
  if (user_id === null) return;

  const label_id = req.params.id;
  const label = labels.getLabel(user_id, Number(label_id));
  // If getLabel function return null- the user does not exist.
  if (label === null) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!isValidId(label_id)) {
    return res.status(400).json({ error: "Missing/Invalid label ID" });
  }
  // If the function return undefined- this means that the user exists,
  // but no label with the received ID was found.
  if (label === undefined) {
    return res.status(404).json({ error: "Label not found" });
  }
  res.json(label);
};

exports.createLabel = (req, res) => {
  const user_id = getValidatedUserId(req, res);
  if (user_id === null) return;

  const { name } = req.body;
  const validate_error = isValidName(name);
  if (validate_error)
    return res
      .status(validate_error.status)
      .json({ error: validate_error.message });

  // Creates a new label for the user
  const new_label = labels.createLabel(user_id, name);
  if (new_label === null) {
    return res.status(404).json({ error: "User not found" });
  }
  if (new_label === undefined) {
    return res.status(409).json({
      error: "The label name you selected already exists. Try a different name",
    });
  }

  res.status(201).location(`/api/labels/${new_label.id}`).end();
};

exports.updateLabel = (req, res) => {
  // Gets and validates the user ID from the headers
  const user_id = getValidatedUserId(req, res);
  if (user_id === null) return;

  const label_id = req.params.id;
  // Checks if the label ID is not a standard number
  if (!isValidId(label_id))
    return res.status(400).json({ error: "Missing/Invalid label ID" });

  const { name } = req.body;
  const validate_error = isValidName(name);
  if (validate_error)
    return res
      .status(validate_error.status)
      .json({ error: validate_error.message });

  //Trying to update the label with the new name, after removing spaces
  const updated_label = labels.updateLabel(user_id, Number(label_id), name);

  // If the user is not found
  if (updated_label === null)
    return res.status(404).json({ error: "User not found" });

  // Check if there is already a label with the same name except for the label itself
  if (updated_label === "conflict") {
    return res.status(409).json({
      error: "The label name you selected already exists. Try a different name",
    });
  }
  // If the label is not found
  if (updated_label === undefined)
    return res.status(404).json({ error: "Label not found" });

  res.status(200).json(updated_label);
};

exports.deleteLabel = (req, res) => {
  const user_id = getValidatedUserId(req, res);
  if (user_id === null) return;

  const label_id = req.params.id;
  if (!isValidId(label_id)) {
    return res.status(400).json({ error: "Missing/Invalid label ID" });
  }

  const user = users.getUserById(user_id);
  const label = user.labels.find((l) => l.id === Number(label_id));

  if (!label) return res.status(404).json({ error: "Label not found" });

  // Extracts the array's emails before deletion
  const labelMails = label.mails || [];

  const deleted_label = labels.deleteLabel(user_id, Number(label_id));
  // Check if the user ID does not exist
  if (deleted_label === null)
    return res.status(404).json({ error: "User not found" });

  // Moves the label emails back to the inbox
  labelMails.forEach((mail) => {
    user.received_mails.push(mail);
  });

  res.status(204).send();
};

exports.removeMailFromLabel = ({ headers, params, body}, res) => {
  const user_id = +headers.user;
  const labelId = +body.labelId;
  const mailId = +params.mail_id;

  const user = users.getUserById(user_id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const label = user.labels.find((l) => l.id === labelId);
  if (!label) return res.status(404).json({ error: "Label not found" });

  const success = labels.removeMail(labelId, mailId, user_id);
  if (!success) {
    return res.status(404).json({ error: "Label or mail not found" });
  }

  res.sendStatus(204);
};

exports.getMailLabels = ({ headers, params }, res) => {
  const user_id = +headers.user;
  const mail_id = +params.mail_id;

  const result = labels.getSpecificMailLabels(user_id, mail_id);
  if (!result) {
    return res.status(404).json({ error: "User or mail not found" });
  }

  res.status(200).json(result);
};
