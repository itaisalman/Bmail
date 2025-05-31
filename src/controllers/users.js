const users = require("../models/users");
const moment = require("moment");

// Validate name
function isValidName(name) {
  return /^[A-Za-z]+$/.test(name);
}

// Validate date format
function isValidBirthDate(dateString) {
  // Checks correct format
  const m = moment(dateString, "DD/MM/YYYY", true);
  if (!m.isValid()) {
    return false;
  }
  // Checks date is earlier than today
  if (m.isAfter(moment())) {
    return false;
  }
  return true;
}

// Validate gender
function isValidGender(gender) {
  const allowed = ["Male", "Female", "Other"];
  return allowed.includes(gender);
}

// Validate username - At least 3 chars, only letters, numbers, hyphens(-), and dots,
// cannot start or end with dot or hyphen, and no consecutive dots allowed.
function isValidUsername(username) {
  return (
    /^[a-zA-Z0-9](?!.*[.]{2})[a-zA-Z0-9.-]{1,}[a-zA-Z0-9]$/.test(username) &&
    username.length >= 3
  );
}

exports.createUser = (req, res) => {
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    username,
    password,
    image,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !username ||
    !password
  ) {
    return res.status(400).json({ error: "Missing required user data" });
  }

  if (!isValidName(first_name) || !isValidName(last_name)) {
    return res.status(400).json({ error: "Invalid name (letters only)" });
  }

  if (!isValidBirthDate(birth_date)) {
    return res
      .status(400)
      .json({ error: "Invalid birth_date format (DD/MM/YYYY)" });
  }

  if (!isValidGender(gender)) {
    return res
      .status(400)
      .json({ error: "Invalid gender (Male/Female/Other)" });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({
      error:
        "Invalid username (At least 3 chars, only letters, numbers, hyphens(-), and dots, cannot start or end with dot or hyphen, and no consecutive dots allowed)",
    });
  }
  // Check if email address already taken
  if (users.isEmailTaken(username + "@bmail.com")) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const createdUser = users.createUser(
    first_name,
    last_name,
    birth_date,
    gender,
    username,
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
