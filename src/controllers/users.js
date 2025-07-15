const userService = require("../services/users");
const mongoose = require("mongoose");
const moment = require("moment");

// Validate name
function isValidName(name) {
  return /^[A-Za-z]+([-' ][A-Za-z]+)*$/.test(name);
}

// Validate date format
function isValidBirthDate(dateString) {
  // Checks correct format
  const m = moment(dateString, "MM/DD/YYYY", true);
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

// Checks if got valid ObjectId for the user.
function checkIfValid(user_id) {
  return mongoose.Types.ObjectId.isValid(user_id);
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
  // Check first name validation
  if (!isValidName(first_name)) {
    return "Invalid first name (letters only)";
  }
  // Check last name validation
  if (!isValidName(last_name)) {
    return "Invalid last name (letters only)";
  }
  // Check date validation
  if (!isValidBirthDate(birth_date)) {
    return "Invalid birth date";
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

exports.createUser = async (req, res) => {
  const { first_name, last_name, birth_date, gender, username, password } =
    req.body;

  // Extract the uploaded file from the request
  const imageFile = req.file;

  // Check all needed arguments were given (image is permission)
  const validationError = validateUserData(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Check if email address already taken
  const taken = await userService.isEmailTaken(username);
  if (taken) {
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

  try {
    const createdUser = await userService.createUser(
      first_name,
      last_name,
      birth_date,
      gender,
      username,
      password,
      finalImage
    );
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).json({ error: "Server error while creating user" });
  }
};

exports.getUserById = async (req, res) => {
  const user_id = req.headers["user"];
  // Check that got valid user_id
  if (!checkIfValid(user_id)) {
    return res.status(400).json({ error: "Missing/Invalid user ID" });
  }

  try {
    // Check if exist
    const user = await userService.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user details without the password (for security)
    const { password, ...safe_user } = user.toObject();
    res.status(200).json(safe_user);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching user" });
  }
};

exports.updateUserTheme = async (req, res) => {
  const user_id = req.headers["user"];
  const { theme } = req.body;

  if (!checkIfValid(user_id) || (theme !== "dark" && theme !== "light")) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const user = await userService.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.theme = theme;
    await user.save();
    return res.status(200).json({ theme });
  } catch (err) {
    res.status(500).json({ error: "Server error while updating theme" });
  }
};
