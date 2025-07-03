const userService = require("../services/users");
const mailService = require("../services/mails");
const blacklist = require("./blacklist");
const mongoose = require("mongoose");

async function checkIfAuthorized(id) {
  if (mongoose.Types.ObjectId.isValid(id))
    return Boolean(await userService.getUserById(id));
}

// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(username) {
  return username.toLowerCase().endsWith("@bmail.com");
}

// Check if the user id exists in the users list.
async function checkIfExist(username) {
  return await userService.getUserByUsername(username);
}

// Extract every url from the given text.
// Return an array of url's.
function extractUrls(text) {
  const urlRegex = /(https?:\/\/)?www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+[0-9]*\b/g;
  const matches = text.match(urlRegex);
  return matches && matches.length > 0 ? matches : [];
}

// Check if the requested arguments passed.
async function checkPostArguments(receiver) {
  if (checkIfValid(receiver) && (await checkIfExist(receiver))) return null;
  return {
    statusCode: 400,
    error: "Invalid/Missing Receiver",
  };
}

// Check the mail ID in the user's mails.
async function checkParamsId(mail_id, user_id) {
  if (
    !mongoose.Types.ObjectId.isValid(mail_id) ||
    !mongoose.Types.ObjectId.isValid(user_id)
  )
    return { statusCode: 400, error: "Invalid mail ID or user ID" };
  const mail = await mailService.getSpecificMail(mail_id);
  if (!mail) return { statusCode: 404, error: "Mail not found" };
  return null;
}

// Check the mail ID in the user's drafts.
async function isDraft(draft_id, user_id) {
  if (
    !mongoose.Types.ObjectId.isValid(draft_id) ||
    !mongoose.Types.ObjectId.isValid(user_id)
  )
    return { statusCode: 400, error: "Invalid draft ID or user ID" };
  const draft = await mailService.getSpecificDraft(draft_id);
  if (!draft) return { statusCode: 404, error: "Draft not found" };
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
exports.getFiftyMails = async ({ headers, query }, res) => {
  const user_id = headers.user;
  const label = headers.label;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });

  // Set default page to 1.
  const page = parseInt(query.page) || 1;

  const user_mails = await mailService.getFiftyMails(user_id, label, page);
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
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const { receiver, title, content } = body;
  let returned_json = await checkPostArguments(receiver);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Extract every url in title and content.
  const extracted_title = extractUrls(title);
  const extracted_content = extractUrls(content);

  let command = "GET ";
  let isSpam = false;

  try {
    // Check if title or content contain bad url.
    if (title) await checkUrls(extracted_title, command);
    if (content) await checkUrls(extracted_content, command);
  } catch (err) {
    if (err.message === "BLACKLISTED") {
      isSpam = true;
    } else {
      return res
        .status(500)
        .json({ error: "Internal server error while checking blacklist" });
    }
  }
  // Always create the mail.
  const created_mail = await mailService.createMail(
    user_id,
    receiver,
    title,
    content,
    isSpam
  );
  res.status(created_mail.statusCode).json(created_mail.message);
};
// Delete a specific mail by its id.
exports.deleteMailById = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const mail_id = params.id;
  const returned_json = await checkParamsId(mail_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  await mailService.deleteSpecificMail(user_id, mail_id);
  res.sendStatus(204);
};

// Return a mail by its id.
exports.getMailById = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const mail_id = params.id;
  let returned_json = await checkParamsId(mail_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Search the mail in the user's mails.
  const mail = await mailService.getSpecificMail(mail_id);
  res.status(200).json(mail);
};

// Return a draft by its id.
exports.getDraftById = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const draft_id = params.id;
  let returned_json = await isDraft(draft_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Search the mail in the user's mails.
  const draft = await mailService.getSpecificDraft(draft_id);
  res.status(200).json(draft);
};

// Return a draft by its id.
exports.deleteDraftById = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const draft_id = params.id;
  let returned_json = await isDraft(draft_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Search the mail in the user's mails.
  await mailService.deleteDraftById(user_id, draft_id);
  res.sendStatus(204);
};

// Search for all the mails that contain query.
// Return an array of all the mails answer the requirement.
exports.searchMails = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const query = params.query;
  const result = await mailService.getMailsByQuery(user_id, query);
  res.status(200).json(result);
};

// Edit fields in the mail.
exports.patchMail = async ({ headers, params, body }, res) => {
  // Check validation of the user ID passed.
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  // Check validation of the id sent by params.
  const draft_id = params.id;
  let returned_json = await isDraft(draft_id, user_id);

  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const draft = await mailService.getSpecificDraft(draft_id);
  // Extract title and content from the body and patch the wanted field or throw appropriate status code.
  const { receiver, title, content } = body;
  // Modify the draft as the user wished.
  if (checkIfValid(receiver))
    await mailService.editDraft(draft, receiver, title, content);
  else await mailService.editDraft(draft, "", title, content);
  res.sendStatus(204);
};

exports.toggleMailStar = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const mail_id = params.id;
  let returned_json = await checkParamsId(mail_id, user_id);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const result = await mailService.toggleStarred(user_id, mail_id);
  if (!result) return res.status(404).json({ error: "Mail not found" });

  res.sendStatus(204);
};

exports.toggleMailImportant = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const mail_id = params.id;
  let returned_json = await checkParamsId(mail_id, user_id);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  const result = await mailService.toggleImportant(user_id, mail_id);
  if (!result) return res.status(404).json({ error: "Mail not found" });

  res.sendStatus(204);
};

// Empty the user's trash array
exports.emptyTrash = async ({ headers }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const result = await mailService.emptyUserTrash(user_id);
  if (!result) {
    return res.status(404).json({ error: "User not found" });
  }
  res.sendStatus(204);
};
// Creating Draft.
exports.createNewDraft = async ({ headers, body }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const { receiver, title, content } = body;
  if (checkIfValid(receiver))
    await mailService.createNewDraft(user_id, receiver, title, content);
  else await mailService.createNewDraft(user_id, "", title, content);
  res.status(201).json({ message: "Draft created" });
};

// Add url into the blacklist by calling the bloomfilter server
function sendUrlBlacklist(url) {
  return new Promise((resolve, reject) => {
    blacklist.connectToBloomFilterServer(url, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

exports.moveMailToSpam = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const mail_id = params.id;

  // Validate parameters
  const returned_json = await checkParamsId(mail_id, user_id);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Check the mail exists
  const mail = await mailService.getSpecificMail(mail_id);
  if (!mail) return res.status(404).json({ error: "Mail not found" });

  // extract urls from mail
  const urls_title = extractUrls(mail.title);
  const urls_content = extractUrls(mail.content);
  const all_urls = [...urls_title, ...urls_content];

  const command = "POST ";
  // Add each url found into the blacklist
  try {
    for (const url of all_urls) {
      await sendUrlBlacklist(command + url);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to blacklist URL: " + err.message });
  }
  // Add the mail to spam
  await mailService.mailToSpam(user_id, mail_id);
  res.sendStatus(201);
};

exports.restoreMailFromSpam = async ({ headers, params }, res) => {
  const user_id = headers.user;
  if (!(await checkIfAuthorized(user_id)))
    return res.status(403).json({ error: "Unauthorized." });
  const mail_id = params.id;

  // Validate parameters
  const returned_json = await checkParamsId(mail_id, user_id);
  if (returned_json)
    return res
      .status(returned_json.statusCode)
      .json({ error: returned_json.error });

  // Check the mail exists
  const mail = await mailService.getSpecificMail(mail_id);
  if (!mail) return res.status(404).json({ error: "Mail not found" });

  // extract urls from mail
  const urls_title = extractUrls(mail.title);
  const urls_content = extractUrls(mail.content);
  const all_urls = [...urls_title, ...urls_content];

  const command = "DELETE ";

  // Add each url found into the blacklist
  try {
    for (const url of all_urls) {
      await sendUrlBlacklist(command + url);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to delete URL: " + err.message });
  }
  // Add the mail to spam
  await mailService.restoreSpammedMail(user_id, mail_id);
  res.sendStatus(204);
};
