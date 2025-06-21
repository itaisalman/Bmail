const mails = require("../models/mails");
const blacklist = require("../models/blacklist");
const users = require("../models/users");

// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(username) {
  return username.toLowerCase().endsWith("@bmail.com");
}

// Check if the user id exists in the users list.
function checkIfExist(username) {
  return users.getUserByUsername(username);
}

// Extract every url from the given text.
// Return an array of url's.
function extractUrls(text) {
  const urlRegex = /(https?:\/\/)?www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+[0-9]*\b/g;
  const matches = text.match(urlRegex);
  return matches && matches.length > 0 ? matches : [];
}

// Check if the requested arguments passed.
function checkPostArguments(receiver) {
  if (checkIfValid(receiver) && checkIfExist(receiver)) return null;
  return {
    statusCode: 400,
    error: "Invalid/Missing Receiver",
  };
}

// Check the mail ID in the user's mails.
function checkParamsId(id, user_id) {
  if (id.trim() !== id || isNaN(+id))
    return { statusCode: 400, error: "Invalid mail ID" };

  const mail = mails.getSpecificMail(+user_id, +id);

  if (!mail) return { statusCode: 404, error: "Mail not found" };

  return null;
}

// Check the mail ID in the user's drafts.
function isDraft(draft_id, user_id) {
  if (draft_id.trim() !== draft_id || isNaN(+draft_id))
    return { statusCode: 400, error: "Invalid draft ID" };

  const mail = mails.getSpecificDraft(+user_id, +draft_id);

  if (!mail) return { statusCode: 404, error: "Draft not found" };

  return null;
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

// For every url, check if the url exists in the blacklist accorading to the server.
function checkUrls(urls, command) {
  return Promise.all(urls.map((url) => checkUrlBlacklist(command.concat(url))));
}

// Return 50 mails by label and page.
exports.getFiftyMails = ({ headers, query }, res) => {
  const user_id = headers.user;
  const label = headers.label;

  // Set default page to 1.
  const page = parseInt(query.page) || 1;

  const user_mails = mails.getFiftyMails(+user_id, label, page);
  if (!user_mails) return res.status(404).json({ error: "No mails found" });

  res.json({
    mails: user_mails.mails,
    totalCount: user_mails.totalCount,
  });
};

// Create new mail using the arguments passed by the user.
// Add it to both sender and receiver mail boxes.
exports.addMail = async ({ headers, body }, res) => {
  const user_id = headers.user;
  const { receiver, title, content } = body;
  let returned_json = checkPostArguments(receiver);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Extract every url in title and content.
  const extracted_title = extractUrls(title);
  const extracted_content = extractUrls(content);
  let command = "GET ";
  try {
    // Check if title or content contain bad url.
    if (title) await checkUrls(extracted_title, command);
    if (content) await checkUrls(extracted_content, command);

    // If all checks passed
    const created_mail = mails.createMail(+user_id, receiver, title, content);
    res.status(created_mail.statusCode).json(created_mail.message);
  } catch (err) {
    if (err.message === "BLACKLISTED")
      return res
        .status(400)
        .json({ error: "Your title or content contain a BLACKLISTED URL !" });
    console.log(err);
    return res
      .status(500)
      .json({ error: "Internal server error while checking blacklist" });
  }
};

// Delete a specific mail by its id.
exports.deleteMailById = ({ headers, params }, res) => {
  const user_id = headers.user;
  const mail_id = params.id;
  let returned_json = checkParamsId(mail_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Search the mail in the user's mails.
  mails.deleteSpecificMail(+user_id, +mail_id);
  res.sendStatus(204);
};

// Return a mail by its id.
exports.getMailById = ({ headers, params }, res) => {
  const user_id = headers.user;
  const mail_id = params.id;
  let returned_json = checkParamsId(mail_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Search the mail in the user's mails.
  const mail = mails.getSpecificMail(+user_id, +mail_id);
  res.status(200).json(mail);
};

// Search for all the mails that contain query.
// Return an array of all the mails answer the requirement.
exports.searchMails = ({ headers, params }, res) => {
  const user_id = headers.user;
  const query = params.query;
  const result = mails.getMailsByQuery(+user_id, query);
  res.status(200).json(result);
};

// Edit fields in the mail.
exports.patchMail = ({ headers, params, body }, res) => {
  // Check validation of the user ID passed.
  const user_id = headers.user;
  // Check validation of the id sent by params.
  const draft_id = params.id;
  let returned_json = isDraft(draft_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const draft = mails.getSpecificDraft(+user_id, +draft_id);
  // Extract title and content from the body and patch the wanted field or throw appropriate status code.
  const { receiver, title, content } = body;
  // Modify the draft as the user wished.
  if (checkIfValid(receiver)) mails.editDraft(draft, receiver, title, content);
  else mails.editDraft(draft, "", title, content);
  res.sendStatus(204);
};

// Creating Draft.
exports.createNewDraft = ({ headers, body }, res) => {
  const user_id = headers.user;
  const { receiver, title, content } = body;
  if (checkIfValid(receiver)) mails.createNewDraft(user_id, receiver, title, content);
  else mails.createNewDraft(user_id, "", title, content);
  res.status(201).json({ message: "Draft created" });
}