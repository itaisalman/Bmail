const blacklist = require("../models/blacklist");
const users = require("../models/users");

// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(user_id) {
  if (!user_id) {
    return false;
  }
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
      Answer: response.trim(),
    });
  });
}

function handleBlacklistOperation(req, res, method) {
  const user_id = parseInt(req.headers["user"]);
  if (!checkIfValid(user_id)) {
    return res
      .status(400)
      .json({ error: "Missing/Invalid user ID or User not found" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

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
