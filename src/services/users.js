const User = require("../models/users");

const buildEmail = (username) => `${username}@bmail.com`;

const createUser = async (
  first_name,
  last_name,
  birth_date,
  gender,
  username,
  password,
  imagePath
) => {
  const user = new User({
    first_name,
    last_name,
    birth_date,
    gender,
    username: buildEmail(username),
    password,
    image: imagePath,
  });
  await user.save();
  return { id: user._id, mail_address: user.username };
};

const getAllUsers = async () => {
  return await User.find({});
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username });
};

// Returns true if mail address exists, and false otherwise.
const isEmailTaken = async (username) => {
  const user = await User.findOne({ username: buildEmail(username) });
  return !!user;
};

const createLabelinUser = async (user_id, label) => {
  await User.updateOne({ _id: user_id }, { $push: { labels: label._id } });
};

const removeLabelFromUser = async (user_id, label_id) => {
  await User.updateOne({ _id: user_id }, { $pull: { labels: label_id } });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  isEmailTaken,
  createLabelinUser,
  removeLabelFromUser,
};
