let user_counter = 0;
const users = [];

// Create new user
const createUser = (
  first_name,
  last_name,
  birth_date,
  gender,
  username,
  password,
  image
) => {
  const newUser = {
    id: ++user_counter,
    first_name: first_name,
    last_name: last_name,
    birth_date: birth_date,
    gender: gender,
    username: username + "@bmail.com",
    password: password,
    image: image,
    received_mails: [],
    sent_mails: [],
    labels: [],
    drafts: [],
  };
  // Add to users array
  users.push(newUser);
  return { id: newUser.id, mail_address: newUser.username };
};

// Check that username is not already in use
const isEmailTaken = (username) => {
  return users.some((user) => user.username === username);
};

// Get user by id from users array (if exists)
const getUserById = (id) => users.find((a) => a.id === id);

// Get users array
const getAllUsers = () => {
  return users;
};

module.exports = {
  createUser,
  isEmailTaken,
  getUserById,
  getAllUsers,
};
