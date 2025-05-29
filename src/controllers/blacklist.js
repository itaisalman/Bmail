const blacklist = require("../models/blacklist");

exports.addUrlToBlacklist = (req, res) => {
  const { url } = req.body;
  // Check if url is missing
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }
  post_request = "POST " + url;
  this.passRequestToServer(post_request, res);
};

exports.passRequestToServer = (req, res) => {
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
};
