const labels = require("../models/labels");

exports.getAllLabels = (req, res) => {
  // Extract the user ID from the headers
  const user_id = parseInt(req.headers["user"]);
  if (!user_id) {
    return res.status(400).json({ error: "Missing ID" });
  }
  // Gets all the user's labels by ID
  const userLabels = labels.getAllLabels(user_id);
  if (!userLabels) {
    return res.status(404).json({ error: "User ID not found" });
  }
  res.json(userLabels);
};

exports.getLabelById = (req, res) => {
  const user_id = parseInt(req.headers["user"]);
  if (!user_id) {
    return res.status(400).json({ error: "Missing ID" });
  }
  const label = labels.getLabel(user_id, parseInt(req.params.id));
  // If getLabel function return null- the user does not exist.
  if (label === null) {
    return res.status(404).json({ error: "User ID not found" });
  }
  // If the function return undefined- this means that the user exists,
  // but no label with the received ID was found.
  if (label === undefined) {
    return res.status(404).json({ error: "Label not found" });
  }
  res.json(label);
};

exports.createLabel = (req, res) => {
  // Extract the user ID from the headers
  const user_id = parseInt(req.headers["user"]);
  if (!user_id) {
    return res.status(400).json({ error: "Missing ID" });
  }
  const { name } = req.body;

  // Check if name is missing or only spaces
  if (!name || name.trim() === "")
    return res.status(400).json({ error: "Name is required" });

  // Creates a new label for the user
  const new_label = labels.createLabel(user_id, name);
  if (!new_label) {
    return res.status(404).json({ error: "User ID not found" });
  }
  res.status(201).location(`/api/labels/${new_label.id}`).end();
};

exports.updateLabel = (req, res) => {
  const user_id = parseInt(req.headers["user"]);
  // Check if user ID is missing
  if (!user_id) {
    return res.status(400).json({ error: "Missing user ID" });
  }
  const update_name = req.body;
  const label_id = parseInt(req.params.id);
  const updated_label = labels.updateLabel(user_id, label_id, update_name);
  // If the user is not found
  if (updated_label === null)
    return res.status(404).json({ error: "User not found" });
  // Validation checks if there is no body or the Name field does not exist
  //  and if the name is empty or contains only spaces
  if (!update_name || !update_name.name || update_name.name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  // Check if the label ID is missing
  if (label_id === undefined) {
    return res.status(400).json({ error: "Missing label ID" });
  }

  // If the label is not found
  if (updated_label === undefined)
    return res.status(404).json({ error: "Label not found" });
  res.status(204).send();
};
