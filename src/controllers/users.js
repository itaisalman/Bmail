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

exports.getUserById = (req, res) => {
  const user = users.getUserById(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Return user details without the password (for security)
  const { password, ...safeUser } = user;
  res.json(safeUser);
};

exports.returnUserId = (req, res) => {
  const { mail_address, password } = req.body;

  if (!mail_address || !password) {
    return res.status(400).json({ error: "Missing mail_address or password" });
  }

  const user = users.findUserByUsernameAndPassword(mail_address, password);

  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }

  res.json({ id: user.id });
};
