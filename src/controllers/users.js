const users = require("../models/users");

exports.createUser = (req, res) => {
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    mail_address,
    password,
    image,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !mail_address ||
    !password
  ) {
    return res.status(400).json({ error: "Missing required user data" });
  }

  // Check if email address already taken
  if (users.isEmailTaken(mail_address)) {
    return res.status(200).json({ error: "Email already registered" });
  }

  const createdUser = users.createUser(
    first_name,
    last_name,
    birth_date,
    gender,
    mail_address,
    password,
    image
  );
  res.status(201).json(createdUser);
};
