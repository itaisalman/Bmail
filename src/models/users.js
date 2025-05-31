let user_counter = 0;
const users = [];

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
  };

  users.push(newUser);
  return { id: newUser.id, mail_address: username };
};

const isEmailTaken = (username) => {
  return users.some((user) => user.username === username);
};

const getUserById = (id) => users.find((a) => a.id === id);

const getAllUsers = () => {
  return users;
};

module.exports = {
  createUser,
  isEmailTaken,
  getUserById,
  getAllUsers,
};
