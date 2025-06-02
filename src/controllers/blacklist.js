const blacklist = require("../models/blacklist");
const users = require("../models/users");

// Checks if got numeric argument
function checkIfValid(user_id) {
  return /^\d+$/.test(user_id);
}

// Check if the user id exists in the users list.
function checkIfExist(user_id) {
  return users.getUserById(user_id);
}

function passRequestToServer(requestString, res, method) {
  blacklist.connectToBloomFilterServer(requestString, (err, response) => {
    // If error occured
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to communicate with BloomFilter server" });
    }
    // Normalize, interpret and return server response
    const trimmed = response.trim();
    if (trimmed === "201 Created") {
      return res
        .status(201)
        .json({ message: "URL added to blacklist successfully" });
    } else if (trimmed === "204 No Content") {
      return res.status(204).send();
    } else if (trimmed === "404 Not Found") {
      return res.status(404).json({ message: "URL not found in blacklist" });
    } else {
      return res.status(400).json({ error: trimmed });
    }
  });
}

// Pass the wanted request to server and check for validation
function handleBlacklistOperation(req, res, method) {
  // Check that got a number
  if (!checkIfValid(req.headers["user_id"])) {
    return res.status(400).json({ error: "Missing/Invalid user_id" });
  }
  // Check that given id is exist
  const user_id = parseInt(req.headers["user_id"]);
  if (!checkIfExist(user_id)) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!req.body) {
    return res.status(400).json({ error: "Missing url" });
  }
  const { url } = req.body;

  // Chain request type and url
  const requestString = `${method} ${url}`;
  passRequestToServer(requestString, res, method);
}

exports.addUrlToBlacklist = (req, res) => {
  handleBlacklistOperation(req, res, "POST");
};

exports.deleteUrlFromBlacklist = (req, res) => {
  handleBlacklistOperation(req, res, "DELETE");
};

exports.passRequestToServer = passRequestToServer;
