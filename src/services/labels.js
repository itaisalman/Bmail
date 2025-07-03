const Label = require("../models/labels");
const userService = require("./users");

const createLabel = async (user_id, name) => {
  const label = new Label({ name, user: user_id });
  await label.save();
  return {
    id: label._id,
    name: label.name,
    user: label.user,
    mails: label.mails,
  };
};

const getAllLabels = async () => {
  return await Label.find({});
};

const getAllUserLabelIds = async (user_id) => {
  return await Label.find({ user: user_id });
};

const getLabelById = async (label_id) => {
  return await Label.findById(label_id);
};

const updateLabel = async (label_id, name) => {
  return await Label.updateOne({ _id: label_id }, { $set: { name: name } });
};

const deleteLabel = async (label_id) => {
  return await Label.deleteOne({ _id: label_id });
};

const assignLabel = async (label_id, mail_id) => {
  return await Label.updateOne(
    { _id: label_id },
    { $addToSet: { mails: mail_id } }
  );
};

const getMailLabels = async (mail_id) => {
  return await Label.find({ mails: mail_id });
};

const removeMailFromLabel = async (label_id, mail_id) => {
  return await Label.updateOne(
    { _id: label_id },
    { $pull: { mails: mail_id } }
  );
};

module.exports = {
  createLabel,
  getAllLabels,
  getAllUserLabelIds,
  getLabelById,
  updateLabel,
  deleteLabel,
  assignLabel,
  getMailLabels,
  removeMailFromLabel,
};
