const mongoose = require("mongoose");
const blacklist = require("../services/blacklist");
const userService = require("../services/users");

// Checks if got valid ObjectId for the user.
function checkIfValid(user_id) {
  return mongoose.Types.ObjectId.isValid(user_id);
}

// Check if the user id exists in the users list.
async function checkIfExist(user_id) {
  return await userService.getUserById(user_id);
}

function passRequestToServer(requestString, res) {
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
async function handleBlacklistOperation(req, res, method) {
  // Check that got a number
  if (!checkIfValid(req.headers["user"])) {
    return res.status(400).json({ error: "Missing/Invalid user ID" });
  }
  // Check that given id is exist
  const user_id = req.headers["user"];
  if (!(await checkIfExist(user_id))) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!req.body) {
    return res.status(400).json({ error: "Missing url" });
  }
  const { url } = req.body;

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
