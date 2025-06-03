const tokens = require("../models/tokens");
const { getUserById } = require("../models/users");

// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(user_id) {
  return /^\d+$/.test(user_id);
}

// Check if the user id exists in the users list.
function checkIfExist(user_id) {
  return getUserById(user_id);
}

// Check if the id given is valid.
function validationCheck(checked_id) {
  if (!checkIfValid(checked_id))
    return { statusCode: 400, error: "Missing/Invalid user ID" };

  const user_id = +checked_id;

  if (!checkIfExist(user_id))
    return { statusCode: 404, error: "User not found" };

  return null;
}

exports.returnUserId = (req, res) => {
  // Check for valid and existed user id in header
  const user_id = req.headers.user;
  let returned_json = validationCheck(user_id);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Extract username and password from body
  const { username, password } = req.body;

  // Check that arguments are given
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  // Check that email address and password are existed
  user = tokens.findUserByUsernameAndPassword(
    username + "@bmail.com",
    password
  );

  // handle user not found
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }

  // return user id
  res.json({ id: user.id });
};
