let user_counter = 0;
const users = [];

const createUser = (
  first_name,
  last_name,
  birth_date,
  gender,
  mail_address,
  password,
  image
) => {
  const newUser = {
    id: ++user_counter,
    first_name: first_name,
    last_name: last_name,
    birth_date: birth_date,
    gender: gender,
    mail_address: mail_address,
    password: password,
    image: image,
    received_mails: [],
    sent_mails: [],
    labels: [],
  };

  users.push(newUser);

  return { id: newUser.id, mail_address: newUser.mail_address };
};

const isEmailTaken = (mail_address) => {
  return users.some((user) => user.mail_address === mail_address);
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
