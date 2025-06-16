const users = require("../models/users");
const moment = require("moment");

// Validate name
function isValidName(name) {
  return /^[A-Za-z]+([-' ][A-Za-z]+)*$/.test(name);
}

// Validate date format
function isValidBirthDate(dateString) {
  // Checks correct format
  const m = moment(dateString, "DD/MM/YYYY", true);
  if (!m.isValid()) {
    return false;
  }
  // Checks date is earlier than today
  return !m.isAfter(moment());
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
// Validate password - 8-12 chars, at least one uppercase letter, one lowercase letter,
// one digit, and one special character
function isValidPassword(password) {
  const lengthCheck = /^.{8,12}$/;
  const upperCaseCheck = /[A-Z]/;
  const lowerCaseCheck = /[a-z]/;
  const digitCheck = /[0-9]/;
  const specialCharCheck = /[^A-Za-z0-9]/;

  return (
    lengthCheck.test(password) &&
    upperCaseCheck.test(password) &&
    lowerCaseCheck.test(password) &&
    digitCheck.test(password) &&
    specialCharCheck.test(password)
  );
}

// Checks if got numeric argument
function checkIfValid(user_id) {
  return /^\d+$/.test(user_id);
}

function validateUserData(data) {
  const { first_name, last_name, birth_date, gender, username, password } =
    data;

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !username ||
    !password
  ) {
    return "Missing required user data";
  }
  // Check names validation
  if (!isValidName(first_name) || !isValidName(last_name)) {
    return "Invalid name (letters only)";
  }
  // Check date validation
  if (!isValidBirthDate(birth_date)) {
    return "Invalid birth_date format (DD/MM/YYYY)";
  }
  // Check gender validation
  if (!isValidGender(gender)) {
    return "Invalid gender (Male/Female/Other)";
  }
  // Check username validation
  if (!isValidUsername(username)) {
    return "Invalid username (At least 3 chars, only letters, numbers, hyphens(-), and dots, cannot start or end with dot or hyphen, and no consecutive dots allowed)";
  }
  if (!isValidPassword(password)) {
    return "Invalid password (8-12 chars, at least one uppercase letter, one lowercase letter, one digit, and one special character)";
  }
  // if no errors found
  return null;
}

exports.createUser = (req, res) => {
  const { first_name, last_name, birth_date, gender, username, password } =
    req.body;

  // // Extract the uploaded file from the request
  const imageFile = req.file;

  // Check all needed arguments were given (image is permission)
  const validationError = validateUserData(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Check if email address already taken
  if (users.isEmailTaken(username + "@bmail.com")) {
    return res.status(409).json({ error: "Email already registered" });
  }

  // Handle image field
  let finalImage;
  if (!imageFile) {
    if (gender.toLowerCase() === "female") {
      finalImage = "upload/default_female.png";
    } else {
      finalImage = "upload/default_male.jpeg";
    }
  } else {
    // If an image was uploaded, use the image's path that saved by Multer
    finalImage = "upload/" + imageFile.filename;
  }

  const createdUser = users.createUser(
    first_name,
    last_name,
    birth_date,
    gender,
    username,
    password,
    finalImage
  );
  res.status(201).json(createdUser);
};

exports.getUserById = (req, res) => {
  // Check that got valid user_id
  if (!checkIfValid(req.params.id)) {
    return res.status(400).json({ error: "Missing/Invalid user ID" });
  }
  // Check if exist
  const user = users.getUserById(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Return user details without the password (for security)
  const { password, ...safeUser } = user;
  res.json(safeUser);
};
