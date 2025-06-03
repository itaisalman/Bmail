const labels = require("../models/labels");

// Checks if the id given is valid
function isValidId(user_id) {
  return /^\d+$/.test(user_id);
}

function isValidName(name, res) {
  // Check if name was not defined at all
  if (name === undefined || name === null) {
    res.status(400).json({ error: "Name is required" });
    return false;
  }
  // Convert to string and remove spaces from beginning and end
  const update_name = String(name).trim();
  if (update_name === "") {
    res.status(400).json({ error: "Name is required" });
    return false;
  }
  // Check if the length exceeds the limit
  if (update_name.length > 225) {
    res.status(400).json({ error: "Name is too long" });
    return false;
  }
  return true;
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
  if (!isValidName(name, res)) return;

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
  if (!isValidName(name, res)) return;

  //Trying to update the label with the new name, after removing spaces
  const updated_label = labels.updateLabel(user_id, Number(label_id), name);
  // If the user is not found
  if (updated_label === null)
    return res.status(404).json({ error: "User not found" });

  // Check if there is already a label with the same name except for the label itself
  if (updated_label === "conflict")
    return res.status(409).json({
      error: "The label name you selected already exists. Try a different name",
    });

  // If the label is not found
  if (updated_label === undefined)
    return res.status(404).json({ error: "Label not found" });
  res.status(204).send();
};

exports.deleteLabel = (req, res) => {
  const user_id = getValidatedUserId(req, res);
  if (user_id === null) return;

  const label_id = req.params.id;
  if (!isValidId(label_id)) {
    return res.status(400).json({ error: "Missing/Invalid label ID" });
  }

  const deleted_label = labels.deleteLabel(user_id, Number(label_id));
  // Check if the user ID does not exist
  if (deleted_label === null)
    return res.status(404).json({ error: "User not found" });
  // If the label does not exist
  if (!deleted_label) return res.status(404).json({ error: "Label not found" });

  res.status(204).send();
};
