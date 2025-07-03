const { Mail, Draft } = require("../models/mails");
const userService = require("./users");
const labelService = require("./labels");

async function findFiftyMails(get_user, label, page) {
  // For built-in labels
  const labelMap = {
    Inbox: get_user.received_mails,
    Sent: get_user.sent_mails,
    Spam: get_user.spam,
    Draft: get_user.drafts,
    Starred: get_user.starred,
    Important: get_user.important,
    Trash: get_user.trash,
  };

  let mails = labelMap[label];

  // Check if got a label created by the user
  if (!mails) {
    const label_id = get_user.labels.find(
      (id) => id.toString() === label.toString()
    );
    if (!label_id) return null;
    let label = await labelService.getLabelById(label_id);
    if (!label) return null;
    mails = label.mails;
  }

  const totalCount = mails.length;

  // Pagination math
  const pageSize = 50;
  const start = Math.max(0, mails.length - page * pageSize);
  const end = mails.length - (page - 1) * pageSize;

  const page_mails = mails.slice(start, end).reverse();
  const mails_array = await Promise.all(
    page_mails.map((mail_id) => getSpecificMail(mail_id))
  );

  return { mails: mails_array, totalCount };
}

function removeMailFromArray(array, mail_id) {
  const index = array.findIndex((id) => id.toString() === mail_id.toString());
  if (index !== -1) array.splice(index, 1);
}

function cleanupMailReferences(user, mail_id) {
  removeMailFromArray(user.sent_mails, mail_id);
  removeMailFromArray(user.received_mails, mail_id);
  removeMailFromArray(user.starred, mail_id);
  removeMailFromArray(user.important, mail_id);
  removeMailFromArray(user.trash, mail_id);
  removeMailFromArray(user.spam, mail_id);

  user.labels.forEach((label) => {
    label.mails = label.mails.filter((mail) => mail.toString() !== mail_id);
  });
}

// Check every relevent field in received mails if it contains query.
async function checkIfContainQueryInMail(mail, query) {
  let sender = await userService.getUserById(mail.sender_id);
  let receiver = await userService.getUserById(mail.receiver_id);
  if (
    sender.username.includes(query) ||
    sender.first_name.includes(query) ||
    sender.last_name.includes(query) ||
    receiver.username.includes(query) ||
    receiver.first_name.includes(query) ||
    receiver.last_name.includes(query) ||
    mail.title.includes(query) ||
    mail.content.includes(query)
  )
    return true;

  return false;
}

// Save the mail in a map so that a mail would not be saved twice.
async function findMailsInArray(result_map, mails_array, query, label) {
  for (const mail_id of mails_array) {
    let mail = await getSpecificMail(mail_id);
    if (await checkIfContainQueryInMail(mail, query)) {
      if (!result_map.has(mail_id)) {
        result_map.set(mail_id, { mail, label });
      }
    }
  }
}

// Check if the mail exists somewhere.
async function checkIfDelete(user, mail_id) {
  const labels = ["received_mails", "sent_mails", "spam", "trash"];
  const foundMail = labels.some((label) => {
    return user[label].some((id) => id.toString() === mail_id.toString());
  });
  return foundMail;
}

// Iterate over the mails to check whether or not to delete them from the schema.
async function checkTrashMails(trash) {
  for (const mail_id of trash) {
    const mail = await getSpecificMail(mail_id);
    const sender = await userService.getUserById(mail.sender_id);
    const receiver = await userService.getUserById(mail.receiver_id);
    if (sender && receiver) {
      const senderCheck = await checkIfDelete(sender, mail_id);
      const receiverCheck = await checkIfDelete(receiver, mail_id);
      if (!(senderCheck || receiverCheck))
        await Mail.deleteOne({ _id: mail_id });
    }
  }
}

function toggleMailInArray(array, mail_id) {
  const index = array.findIndex((id) => id.toString() === mail_id.toString());
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(mail_id);
  }
}

// Find and return fifty mails by the given page.
const getFiftyMails = async (user_id, label, page = 1) => {
  const user = await userService.getUserById(user_id);
  if (!user) return null;
  return await findFiftyMails(user, label, page);
};

// Find the specific mail that the user want.
// Return null if doesnt exist.
const getSpecificMail = async (id) => {
  return await Mail.findById(id);
};

// Create a new mail
// Define its properties and add them to both sender and receiver.
const createMail = async (sender, receiver, title, content, isSpam) => {
  const sender_user = await userService.getUserById(sender);
  const receiver_user = await userService.getUserByUsername(receiver);
  const new_mail = new Mail({
    sender_id: sender_user._id,
    receiver_id: receiver_user._id,
    title,
    content,
  });
  await new_mail.save();
  sender_user.sent_mails.push(new_mail._id);
  // If isSpam - mail contains "bad URL" and will be added to reciever's spam and not inbox
  if (isSpam) {
    receiver_user.spam.push(new_mail._id);
  } else {
    receiver_user.received_mails.push(new_mail._id);
  }
  await sender_user.save();
  await receiver_user.save();
  return { statusCode: 201, message: "Mail created" };
};

// delete mail
const deleteSpecificMail = async (user_id, mail_id) => {
  const user = await userService.getUserById(user_id);
  cleanupMailReferences(user, mail_id);
  user.trash.push(mail_id);
  await user.save();
};

// Create the wanted mails array.
// Search if the mails in sent_mails and received_mails contain the query.
const getMailsByQuery = async (user_id, query) => {
  const user = await userService.getUserById(user_id);
  const result_map = new Map();
  await findMailsInArray(result_map, user.received_mails, query, "inbox");
  await findMailsInArray(result_map, user.sent_mails, query, "sent");
  await findMailsInArray(result_map, user.spam, query, "spam");
  await findMailsInArray(result_map, user.trash, query, "trash");
  return Array.from(result_map.values());
};

// Change the wanted fields in draft.
const editDraft = async (draft_id, receiver, title, content) => {
  await Draft.updateOne(
    { _id: draft_id },
    { $set: { receiver_address: receiver, title, content } }
  );
  return;
};

// Find the specific draft that the user want to modify.
// Return null if doesnt exist.
const getSpecificDraft = async (id) => {
  return await Draft.findById(id);
};

// Create a new draft with the passed arguments.
const createNewDraft = async (sender, receiver_address, title, content) => {
  const sender_user = await userService.getUserById(sender);
  const new_draft = new Draft({ receiver_address, title, content });
  await new_draft.save();
  sender_user.drafts.push(new_draft._id);
  await sender_user.save();
  return;
};

// Delete the draft from Draft schema and in drafts label in user.
const deleteDraftById = async (user_id, draft_id) => {
  const user = await userService.getUserById(user_id);
  const draft_index = user.drafts.findIndex(
    (draft) => draft.toString() === draft_id.toString()
  );

  user.drafts.splice(draft_index, 1);
  await Draft.deleteOne({ _id: draft_id });
  await user.save();
  return;
};

const toggleStarred = async (user_id, mail_id) => {
  const user = await userService.getUserById(user_id);
  toggleMailInArray(user.starred, mail_id);
  await user.save();
  return true;
};

const toggleImportant = async (user_id, mail_id) => {
  const user = await userService.getUserById(user_id);
  toggleMailInArray(user.important, mail_id);
  await user.save();
  return true;
};

// Empty the user's trash array
const emptyUserTrash = async (user_id) => {
  const user = await userService.getUserById(user_id);
  if (!user) return false;
  await checkTrashMails(user.trash);
  user.trash = [];
  await user.save();
  return true;
};

// Move mail to user's spam.
const mailToSpam = async (user_id, mail_id) => {
  const user = await userService.getUserById(user_id);
  cleanupMailReferences(user, mail_id);
  user.spam.push(mail_id);
  await user.save();
};

const restoreSpammedMail = async (user_id, mail_id) => {
  const user = await userService.getUserById(user_id);
  if (!user) return;

  const wanted_mail = await getSpecificMail(mail_id);
  if (!wanted_mail) return;

  removeMailFromArray(user.spam, mail_id);

  if (wanted_mail.sender_id.toString() === user_id) {
    user.sent_mails.push(mail_id);
  }
  if (wanted_mail.receiver_id.toString() === user_id) {
    user.received_mails.push(mail_id);
  }
  await user.save();
  return true;
};

module.exports = {
  getFiftyMails,
  getSpecificMail,
  createMail,
  deleteSpecificMail,
  getMailsByQuery,
  editDraft,
  getSpecificDraft,
  createNewDraft,
  deleteDraftById,
  toggleStarred,
  toggleImportant,
  emptyUserTrash,
  mailToSpam,
  restoreSpammedMail,
};
