const blacklist = require("../models/blacklist");
const users = require("../models/users");

// Checks if got numeric argument
function checkIfValid(user_id) {
  if (!user_id || isNaN(user_id)) {
    return false;
  }
  return true;
}

// Check if the user id exists in the users list.
function checkIfExist(user_id) {
  if (!users.getUserById(user_id)) {
    return false;
  }
  return true;
}

function passRequestToServer(req, res) {
  blacklist.connectToBloomFilterServer(req, (err, response) => {
    // If error occured
    if (err) {
      console.error("Error communicating with BloomFilter server:", err);
      return res
        .status(500)
        .json({ error: "Failed to communicate with BloomFilter server" });
    }
    // return the string returned from BloomFilter servers
    return res.status(201).json({
      answer: response.trim(),
    });
  });
}

// Pass the wanted request to server and check for validation
function handleBlacklistOperation(req, res, method) {
  // Check that got a number
  if (!checkIfValid(req.headers["user"])) {
    return res
      .status(400)
      .json({ error: "Missing/Invalid user ID or User not found" });
  }
  // Check that given id is exist
  const user_id = parseInt(req.headers["user"]);
  if (!checkIfExist(user_id)) {
    return res.status(404).json({ error: "User not found" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }
  // Chain request type and url
  const requestString = `${method} ${url}`;
  passRequestToServer(requestString, res);
}

exports.addUrlToBlacklist = (req, res) => {
  handleBlacklistOperation(req, res, "POST");
};

exports.deleteUrlFromBlacklist = (req, res) => {
  handleBlacklistOperation(req, res, "DELETE");
};

exports.passRequestToServer = passRequestToServer;
