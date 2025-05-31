const mails = require("../models/mails");
const blacklist = require("../models/blacklist");
const users = require("../models/users");

// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(user_id) {
  return /^\d+$/.test(user_id);
}

// Check if the user id exists in the users list.
function checkIfExist(user_id) {
  return users.getUserById(user_id);
}

// Extract every url from the given text.
// Return an array of url's.
function extractUrls(text) {
  const urlRegex = /(https?:\/\/)?www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+[0-9]*\b/g;
  const matches = text.match(urlRegex);
  return matches && matches.length > 0 ? matches : [];
}

// Check if the requested arguments passed.
function checkPostArguments({ receiver, title, content }) {
  return (
    receiver && title && content && title.trim().length && content.trim().length
  );
}

// Check if the url is in the blacklist.
function checkUrlBlacklist(url) {
  // Creating a promise because the operation is asynchronic.
  return new Promise((resolve, reject) => {
    blacklist.connectToBloomFilterServer(url, (err, result) => {
      // Error occured in the connection.
      if (err) return reject(err);
      // The result that we got from the server contains a bad url.
      // Which means we cant create the mail as wished.
      if (!result.includes("false")) return reject(new Error("BLACKLISTED"));
      // Not blacklisted.
      resolve();
    });
  });
}

// Check if the id given is valid.
function validationCheck(checked_id) {
  if (!checkIfValid(checked_id)) {
    return { statusCode: 400, error: "Missing/Invalid user ID" };
  }
  const user_id = +checked_id;
  if (!checkIfExist(user_id)) {
    return { statusCode: 404, error: "User not found" };
  }
  return null;
}

// Generates the loops that checks the urls.
async function checkUrls(urls, command) {
  for (const url of urls) {
    await checkUrlBlacklist(command.concat(url));
  }
}

// Return the latest 50 mails from sent and received mails of user.
exports.getFiftyMails = ({ headers }, res) => {
  const user_id = headers.user;
  const returned_json = validationCheck(user_id);
  if (returned_json) {
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });
  }
  const user_mails = mails.getFiftyMails(+user_id);
  res.json(user_mails);
};

// Create new mail using the arguments passed by the user.
// Add it to both sender and receiver mail boxes.
exports.addMail = async ({ headers, body }, res) => {
  const user_id = headers.user;
  const returned_json = validationCheck(user_id);
  if (returned_json) {
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });
  }
  const { receiver, title, content } = body;
  // Check if required arguments passed.
  if (!checkPostArguments({ receiver, title, content })) {
    return res.status(400).json({
      error: "Receiver, Title and Content is required or Invalid arguments",
    });
  }
  // Extract every url in title and content.
  const extracted_title = extractUrls(title);
  const extracted_content = extractUrls(content);
  let command = "GET ";
  try {
    // Check if title or content contain bad url.
    await checkUrls(extracted_title, command);
    await checkUrls(extracted_content, command);

    // If all checks passed
    const created_mail = mails.createMail(+user_id, receiver, title, content);
    res.status(201).json(created_mail);
  } catch (err) {
    if (err.message === "BLACKLISTED") {
      return res
        .status(400)
        .json({ error: "Your title or content contain a BLACKLISTED URL !" });
    }
    return res
      .status(500)
      .json({ error: "Internal server error while checking blacklist" });
  }
};

// Delete a specific mail by its id.
exports.deleteMailById = ({ headers, params }, res) => {
  const user_id = headers.user;
  const returned_json = validationCheck(user_id);
  if (returned_json) {
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });
  }
  // Search the mail in the user's mails.
  const deleted_mail = mails.deleteSpecificMail(+user_id, +params.id);
  if (!deleted_mail) {
    return res.status(404).json({ error: "Mail not found" });
  }
  res.sendStatus(204);
};

// Return a mail by its id.
exports.getMailById = ({ headers, params }, res) => {
  const user_id = headers.user;
  const returned_json = validationCheck(user_id);
  if (returned_json) {
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });
  }
  // Search the mail in the user's mails.
  const mail = mails.getSpecificMail(+user_id, +params.id);
  res.status(200).json(mail);
};

// Search for all the mails that contain query.
// Return an array of all the mails answer the requirement.
exports.searchMails = ({ headers, params }, res) => {
  const user_id = headers.user;
  const returned_json = validationCheck(user_id);
  if (returned_json) {
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });
  }
  const query = params.query;
  const result = mails.getMailsByQuery(+user_id, query);
  res.status(200).json(result);
};
