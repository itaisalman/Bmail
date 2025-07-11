const mongoose = require("mongoose");
const labelService = require("../services/labels");
const userService = require("../services/users");

// Checks if got valid ObjectId for the user.
function checkIfValid(user_id) {
  return mongoose.Types.ObjectId.isValid(user_id);
}

const getValidatedUserId = (req) => {
  const user_id = req.headers["user"];
  if (!checkIfValid(user_id)) {
    return null;
  }

  return user_id;
};

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

const isDuplicateLabelName = (labels, name, ignoreId = null) => {
  const update_name = name.toLowerCase().trim();
  if (!update_name) return true;

  if (DEFAULT_LABEL_NAMES.includes(update_name)) return true;

  return labels.some((label) => {
    if (ignoreId && label._id.toString() === ignoreId.toString()) return false;

    const currentName = label.name.toLowerCase().trim();
    const sameName = currentName === update_name;

    return sameName;
  });
};

const isValidName = (name) => {
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
};

exports.getAllUserLabels = async (req, res) => {
  try {
    const user_id = getValidatedUserId(req);
    if (user_id === null) {
      return res.status(400).json({ error: "Missing/Invalid user ID" });
    }

    const userLabels = await labelService.getAllUserLabelIds(user_id);
    res.status(200).json(userLabels);
  } catch (err) {
    console.error("Error in getAllLabels:", err);
    res.status(500).json({ error: "Server error while getting all labels" });
  }
};

exports.getLabelById = async (req, res) => {
  try {
    const { label_id } = req.params;
    if (!checkIfValid(label_id)) {
      return res.status(400).json({ error: "Invalid label ID" });
    }
    const label = await labelService.getLabelById(label_id);

    if (!label) {
      return res.status(404).json({ error: "Label not found" });
    }

    res.status(200).json(label);
  } catch (err) {
    console.error("Error in get getLabelById:", err);
    res.status(500).json({ error: "Server error while getting label by Id" });
  }
};

exports.createLabel = async (req, res) => {
  try {
    const user_id = getValidatedUserId(req);
    if (user_id === null) {
      return res.status(400).json({ error: "Missing/Invalid user ID" });
    }

    const { name } = req.body;

    const nameError = isValidName(name);
    if (nameError) {
      return res.status(nameError.status).json({ error: nameError.message });
    }

    const userLabels = await labelService.getAllUserLabelIds(user_id);
    if (isDuplicateLabelName(userLabels, name))
      return res.status(409).json({
        error:
          "The label name you selected already exists. Try a different name",
      });

    const label = await labelService.createLabel(user_id, name);
    res.status(201).json(label);
  } catch (err) {
    console.error("Error in createLabel:", err);
    res.status(500).json({ error: "Server error while creating label" });
  }
};

exports.updateLabel = async (req, res) => {
  try {
    const user_id = getValidatedUserId(req);
    if (user_id === null) {
      return res.status(400).json({ error: "Missing/Invalid user ID" });
    }

    const label_id = req.params._id;
    if (!checkIfValid(label_id) || !label_id) {
      return res.status(400).json({ error: "Missing/Invalid label ID" });
    }

    const { name } = req.body;

    const userLabels = await labelService.getAllUserLabelIds(user_id);
    if (isDuplicateLabelName(userLabels, name, label_id))
      return res.status(409).json({
        error:
          "The label name you selected already exists. Try a different name",
      });

    const updated_label = await labelService.updateLabel(label_id, name);

    if (!updated_label.matchedCount) {
      return res.status(404).json({ error: "Label not found" });
    }

    res.status(200).json(updated_label);
  } catch (err) {
    console.error("Error in updateLabel:", err);
    res.status(500).json({ error: "Server error while updating label" });
  }
};

exports.deleteLabel = async (req, res) => {
  try {
    const user_id = getValidatedUserId(req);
    if (user_id === null) {
      return res.status(400).json({ error: "Missing/Invalid user ID" });
    }
    const label_id = req.params._id;
    if (!checkIfValid(label_id) || !label_id) {
      return res.status(400).json({ error: "Missing/Invalid label ID" });
    }

    const result = await labelService.deleteLabel(user_id, label_id);
    if (!result.deletedCount) {
      return res.status(404).json({ error: "Label not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error in get deleteLabel:", err);
    res.status(500).json({ error: "Server error while deleting label" });
  }
};

exports.assignMailToLabel = async (req, res) => {
  try {
    const label_id = req.body.label_id;
    const mail_id = req.params.mail_id;

    if (!checkIfValid(label_id) || !checkIfValid(mail_id)) {
      return res.status(400).json({ error: "Invalid label/mail ID" });
    }

    const success = await labelService.assignLabel(label_id, mail_id);

    if (!success || success.matchedCount === 0) {
      return res.status(404).json({ error: "Label or mail not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error in assignLabelToMail:", err);
    res
      .status(500)
      .json({ error: "Server error while assigning label to mail" });
  }
};

exports.getMailLabels = async (req, res) => {
  try {
    const mail_id = req.params.mail_id;
    if (!checkIfValid(mail_id)) {
      return res.status(400).json({ error: "Invalid mail ID" });
    }

    const labels = await labelService.getMailLabels(mail_id);

    res.status(200).json(labels);
  } catch (err) {
    console.error("Error in getMailLabels:", err);
    res.status(500).json({ error: "Server error while getting mail labels" });
  }
};

exports.removeMailFromLabel = async (req, res) => {
  try {
    const label_id = req.body.label_id;
    const mail_id = req.params.mail_id;

    if (!checkIfValid(label_id) || !checkIfValid(mail_id)) {
      return res.status(400).json({ error: "Invalid label/mail ID" });
    }

    const success = await labelService.removeMailFromLabel(label_id, mail_id);
    if (!success || success.matchedCount === 0) {
      return res.status(404).json({ error: "Label or mail not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error in removeMailFromLabel:", err);
    res
      .status(500)
      .json({ error: "Server error while removing mail from label" });
  }
};
