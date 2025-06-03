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
function checkPostArguments({ receiver, title, content, draft }) {
  if (draft === undefined || draft === null) {
    return {
      statusCode: 400,
      error: "Missing draft field",
    };
  }
  draft_string = draft.toString();
  if (
    receiver &&
    title &&
    content &&
    title.trim().length &&
    content.trim().length &&
    (draft_string.toLowerCase() === "true" ||
      draft_string.toLowerCase() === "false")
  ) {
    if (checkIfValid(receiver)) {
      if (checkIfExist(+receiver)) return null;

      return { statusCode: 404, error: "Receiver not found" };
    }
    return { statusCode: 400, error: "Invalid receiver ID" };
  }
  return {
    statusCode: 400,
    error: "Missing/Invalid Title or Content",
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
function isDraft(mail_id, user_id) {
  if (mail_id.trim() !== mail_id || isNaN(+mail_id))
    return { statusCode: 400, error: "Invalid mail ID" };

  const mail = mails.getSpecificDraft(+user_id, +mail_id);

  if (!mail) return { statusCode: 404, error: "Mail not found" };

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

// Check if the id given is valid.
function validationCheck(checked_id) {
  if (!checkIfValid(checked_id))
    return { statusCode: 400, error: "Missing/Invalid user ID" };

  const user_id = +checked_id;

  if (!checkIfExist(user_id))
    return { statusCode: 404, error: "User not found" };

  return null;
}

// For every url, check if the url exists in the blacklist accorading to the server.
function checkUrls(urls, command) {
  return Promise.all(urls.map((url) => checkUrlBlacklist(command.concat(url))));
}

// Return the latest 50 mails from sent and received mails of user.
exports.getFiftyMails = ({ headers }, res) => {
  const user_id = headers.user;
  const returned_json = validationCheck(user_id);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const user_mails = mails.getFiftyMails(+user_id);
  res.json(Array.from(user_mails));
};

// Create new mail using the arguments passed by the user.
// Add it to both sender and receiver mail boxes.
exports.addMail = async ({ headers, body }, res) => {
  const user_id = headers.user;
  let returned_json = validationCheck(user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const { receiver, title, content, draft } = body;
  returned_json = checkPostArguments({ receiver, title, content, draft });
  // Check if required arguments passed.

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
    await checkUrls(extracted_title, command);
    await checkUrls(extracted_content, command);

    // If all checks passed
    const created_mail = mails.createMail(
      +user_id,
      +receiver,
      title,
      content,
      draft
    );
    res.status(created_mail.statusCode).json(created_mail.message);
  } catch (err) {
    if (err.message === "BLACKLISTED")
      return res
        .status(400)
        .json({ error: "Your title or content contain a BLACKLISTED URL !" });

    return res
      .status(500)
      .json({ error: "Internal server error while checking blacklist" });
  }
};

// Delete a specific mail by its id.
exports.deleteMailById = ({ headers, params }, res) => {
  const user_id = headers.user;
  let returned_json = validationCheck(user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const mail_id = params.id;
  returned_json = checkParamsId(mail_id, user_id);

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
  let returned_json = validationCheck(user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const mail_id = params.id;
  returned_json = checkParamsId(mail_id, user_id);

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
  const returned_json = validationCheck(user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const query = params.query;
  const result = mails.getMailsByQuery(+user_id, query);
  res.status(200).json(result);
};

// Edit fields in the mail.
exports.patchMail = ({ headers, params, body }, res) => {
  // Check validation of the user ID passed.
  const user_id = headers.user;
  let returned_json = validationCheck(user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Check validation of the id sent by params.
  const mail_id = params.id;
  returned_json = isDraft(mail_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const mail = mails.getSpecificDraft(+user_id, +mail_id);
  // Extract title and content from the body and patch the wanted field or throw appropriate status code.
  const { title, content, draft } = body;

  if (!title && !content && !draft)
    return res.status(400).json({ error: "Title, Content or Draft required" });

  // Modify the draft as the user wished.
  mails.editDraft(mail, title, content, draft);
  res.sendStatus(204);
};
