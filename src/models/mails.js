let mail_counter = 0;
let draft_counter = 0;
const users = require("./users");
const blacklist = require("./blacklist");

// extract wanted label - where to get the mails from
function findFiftyMails(get_user, label_name, page) {
  // For built in labels
  const labelMap = {
    Inbox: get_user.received_mails,
    Sent: get_user.sent_mails,
    Spam: get_user.spam,
    Draft: get_user.drafts,
    Starred: get_user.starred,
    Important: get_user.important,
    Trash: get_user.trash,
  };

  let mails = labelMap[label_name];

  // Check if got a label created by the user
  if (!mails) {
    const label = get_user.labels.find((label) => label.name === label_name);
    if (!label || !Array.isArray(label.mails)) return null;
    mails = label.mails;
  }

  const totalCount = mails.length;

  // Calculate the borders of wanted mails indices
  const pageSize = 50;
  const start = Math.max(0, mails.length - page * pageSize);
  const end = mails.length - (page - 1) * pageSize;

  // return wanted fifty mails.
  const page_mails = mails.slice(start, end).reverse();
  return { mails: page_mails, totalCount };
}

// Remove the draft from the draft's array, and add it to the mail's array.
function uploadDraft(mail) {
  // Extract the users in order to add the mails to their inbox/sent.
  const sender_id = mail.sender_id;
  const receiver_id = mail.receiver_id;
  const sender_user = users.getUserById(sender_id);
  const receiver_user = users.getUserById(receiver_id);
  const draft_index = sender_user.drafts.findIndex(
    (draft) => draft.id === mail.id
  );
  sender_user.drafts.splice(draft_index, 1);
  pushToMailsArray(sender_user, receiver_user, mail);
}

// Push the mail to the corresponding places for both sender and receiver.
function pushToMailsArray(sender_user, receiver_user, mail) {
  sender_user.sent_mails.push(mail);
  receiver_user.received_mails.push(mail);
}
// Iterate over each mail in the sent_mails_array.
// If they contain query, they will be added to the result_array.
function findMailsInSent(result_array, mails_array, query) {
  for (const mail of mails_array) {
    if (checkIfContainQueryInSent(mail, query)) result_array.push(mail);
  }
}

// Iterate over each mail in the received_mails_array.
// If they contain query, they will be added to the result_array.
function findMailsInReceived(result_array, mails_array, query) {
  for (const mail of mails_array) {
    if (checkIfContainQueryInReceived(mail, query)) result_array.push(mail);
  }
}

// Check every relevent field in sent mails if it contains query.
function checkIfContainQueryInSent(mail, query) {
  if (
    mail.receiver_address.includes(query) ||
    mail.receiver_first_name.includes(query) ||
    mail.receiver_last_name.includes(query) ||
    mail.title.includes(query) ||
    mail.content.includes(query)
  )
    return true;

  return false;
}

// Check every relevent field in received mails if it contains query.
function checkIfContainQueryInReceived(mail, query) {
  if (
    mail.sender_address.includes(query) ||
    mail.sender_first_name.includes(query) ||
    mail.sender_last_name.includes(query) ||
    mail.title.includes(query) ||
    mail.content.includes(query)
  )
    return true;

  return false;
}

const getFiftyMails = (user_id, label, page = 1) => {
  // Return null if this user_id does not exist.
  const get_user = users.getUserById(user_id);

  if (!get_user) return null;

  return findFiftyMails(get_user, label, page);
};

// Create a new mail
// Define its properties and add them to both sender and receiver.
const createMail = (sender, receiver, title, content, isSpam) => {
  const sender_user = users.getUserById(sender);
  const receiver_user = users.getUserByUsername(receiver);
  const new_mail = {
    id: ++mail_counter,
    sender_id: sender,
    sender_address: sender_user.username,
    sender_first_name: sender_user.first_name,
    sender_last_name: sender_user.last_name,
    receiver_id: receiver_user.id,
    receiver_address: receiver_user.username,
    receiver_first_name: receiver_user.first_name,
    receiver_last_name: receiver_user.last_name,
    title: title,
    content: content,
    date: new Date(),
  };
  sender_user.sent_mails.push(new_mail);
  // If isSpam - mail contains "bad URL" and will be added to reciever's spam and not inbox
  if (isSpam) {
    receiver_user.spam.push(new_mail);
  } else {
    receiver_user.received_mails.push(new_mail);
  }
  return { statusCode: 201, message: "Mail created" };
};

// Find the specific draft that the user want to modify.
// Return null if doesnt exist.
const getSpecificDraft = (user_id, draft_id) => {
  // Return null if this user_id does not exist.
  const user = users.getUserById(user_id);
  const draft = user.drafts.find((draft) => draft.id === draft_id);
  if (!draft) return null;
  return draft;
};

const deleteDraftById = (user_id, draft_id) => {
  const user = users.getUserById(user_id);
  const draft_index = user.drafts.findIndex((draft) => draft.id === draft_id);
  user.drafts.splice(draft_index, 1);
  return;
};

const getMailFromArray = (mail_id, user_array) => {
  return user_array.find((mail) => mail.id === mail_id);
};

// Find the specific mail that the user want.
// Return null if doesnt exist.
const getSpecificMail = (user_id, mail_id) => {
  // Return null if this user_id does not exist.
  const get_user = users.getUserById(user_id);
  if (!get_user) return null;
  // Search the mail in all possible arrays. If not there returns null.
  const allSources = [
    get_user.received_mails,
    get_user.sent_mails,
    get_user.spam,
    get_user.trash,
  ];

  for (const source of allSources) {
    const mail = getMailFromArray(mail_id, source);
    if (mail) return mail;
  }
  return null;
};

// Create the wanted mails array.
// Search if the mails in sent_mails and received_mails contain the query.
const getMailsByQuery = (user_id, query) => {
  const user = users.getUserById(user_id);
  const result_array = [];
  findMailsInSent(result_array, user.sent_mails, query);
  findMailsInReceived(result_array, user.received_mails, query);
  return result_array;
};

// Change the wanted fields in draft.
const editDraft = (draft, receiver, title, content) => {
  draft.receiver = receiver.toString();
  draft.title = title.toString();
  draft.content = content.toString();
  return;
};

const toggleMailInArray = (array, mail) => {
  const index = array.findIndex((m) => m.id === mail.id);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(mail);
  }
};

const toggleStarred = (user_id, mail_id) => {
  const mail = getSpecificMail(user_id, mail_id);
  if (!mail) return false;
  const user = users.getUserById(user_id);
  toggleMailInArray(user.starred, mail);
  return true;
};

const toggleImportant = (user_id, mail_id) => {
  const mail = getSpecificMail(user_id, mail_id);
  if (!mail) return false;
  const user = users.getUserById(user_id);
  toggleMailInArray(user.important, mail);
  return true;
};

const removeMailFromArray = (array, mail_id) => {
  const index = array.findIndex((mail) => mail.id === mail_id);
  if (index !== -1) array.splice(index, 1);
};

// Remove mail from all labels
const cleanupMailReferences = (user, mail_id) => {
  removeMailFromArray(user.sent_mails, mail_id);
  removeMailFromArray(user.received_mails, mail_id);
  removeMailFromArray(user.starred, mail_id);
  removeMailFromArray(user.important, mail_id);
  removeMailFromArray(user.trash, mail_id);
  removeMailFromArray(user.spam, mail_id);

  user.labels.forEach((label) => {
    label.mails = label.mails.filter((mail) => mail.id !== mail_id);
  });
};

// delete mail
const deleteSpecificMail = (user_id, mail_id) => {
  const user = users.getUserById(user_id);
  const wanted_mail = getSpecificMail(user_id, mail_id);
  cleanupMailReferences(user, mail_id);
  user.trash.push(wanted_mail);
};

// Move mail to user's spam.
const mailToSpam = (user_id, mail_id) => {
  const user = users.getUserById(user_id);
  const wanted_mail = getSpecificMail(user_id, mail_id);
  if (!wanted_mail) return;
  cleanupMailReferences(user, mail_id);
  user.spam.push(wanted_mail);
};

// Empty the user's trash array
const emptyUserTrash = (user_id) => {
  const user = users.getUserById(user_id);
  if (!user) return false;
  user.trash = [];
  return true;
};
// Create a new draft with the passed arguments.
const createNewDraft = (sender, receiver, title, content) => {
  const sender_user = users.getUserById(sender);
  const new_draft = {
    id: ++draft_counter,
    receiver,
    title,
    content,
    date: new Date(),
  };
  sender_user.drafts.push(new_draft);
  return;
};

const restorSpammedMail = (user_id, mail_id) => {
  const user = users.getUserById(user_id);
  if (!user) return;

  const wanted_mail = getSpecificMail(user_id, mail_id);
  if (!wanted_mail) return;

  removeMailFromArray(user.spam, mail_id);
  if (wanted_mail.sender_id == user_id) {
    user.sent_mails.push(wanted_mail);
  }
  if (wanted_mail.receiver_id == user_id) {
    user.received_mails.push(wanted_mail);
  }
  return true;
};

module.exports = {
  getFiftyMails,
  createMail,
  getSpecificMail,
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
  restorSpammedMail,
};
