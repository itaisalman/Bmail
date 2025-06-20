let mail_counter = 0;
const users = require("./users");

function findFiftyMails(get_user, label_name) {
  const labelMap = {
    Inbox: get_user.received_mails,
    Sent: get_user.sent_mails,
    Spam: get_user.spam,
    Draft: get_user.drafts,
    Starred: get_user.starred,
    Important: get_user.important,
  };

  let mails = labelMap[label_name];
  // Check if got a label created by the user
  if (!mails) {
    const label = get_user.labels.find((label) => label.name === label_name);
    if (!label || !Array.isArray(label.mails)) return null;
    mails = label.mails;
  }

  // Takes most recent fifty mails
  const latestMails = mails.slice(-50).reverse();
  return latestMails;
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

const getFiftyMails = (user_id, label) => {
  // Return null if this user_id does not exist.
  const get_user = users.getUserById(user_id);

  if (!get_user) return null;

  return findFiftyMails(get_user, label);
};

// Create a new mail
// Define its properties and add them to both sender and receiver.
const createMail = (sender, receiver, title, content) => {
  const sender_user = users.getUserById(sender);
  const receiver_user = users.getUserByUsername(receiver);
  const new_mail = {
    id: ++mail_counter,
    sender_id: sender,
    sender_address: sender_user.username,
    sender_first_name: sender_user.first_name,
    sender_last_name: sender_user.last_name,
    receiver_id: receiver,
    receiver_address: receiver_user.username,
    receiver_first_name: receiver_user.first_name,
    receiver_last_name: receiver_user.last_name,
    title: title,
    content: content,
    date: new Date(),
  };
  pushToMailsArray(sender_user, receiver_user, new_mail);
  return { statusCode: 201, message: "Mail created" };
};

const deleteSpecificMail = (user_id, mail_id) => {
  const get_user = users.getUserById(user_id);
  // Check if the mail is in received or in sent.
  // If not in both, return null.
  const get_mail_from_received = get_user.received_mails.find(
    (mail) => mail.id === mail_id
  );
  if (!get_mail_from_received) {
    const get_mail_from_sent = get_user.sent_mails.find(
      (mail) => mail.id === mail_id
    );

    if (!get_mail_from_sent) return;

    // Find the mail that the user want to delete, and delete it from sent_mails.
    const sent_index = get_user.sent_mails.findIndex(
      (mail) => mail.id === mail_id
    );
    get_user.sent_mails.splice(sent_index, 1);
    return;
  }
  // Find the mail that the user want to delete, and delete it from received_mails.
  const received_index = get_user.received_mails.findIndex(
    (mail) => mail.id === mail_id
  );
  get_user.received_mails.splice(received_index, 1);
  return;
};

// Find the specific draft that the user want to modify.
// Return null if doesnt exist.
const getSpecificDraft = (user_id, mail_id) => {
  // Return null if this user_id does not exist.
  const user = users.getUserById(user_id);
  const mail = user.drafts.find((draft) => draft.id === mail_id);
  if (!mail) return null;
  return mail;
};

// Find the specific mail that the user want.
// Return null if doesnt exist.
const getSpecificMail = (user_id, mail_id) => {
  // Return null if this user_id does not exist.
  const get_user = users.getUserById(user_id);
  // Check if the mail is in received or in sent.
  // If not in both, return null.
  const get_mail_from_received = get_user.received_mails.find(
    (mail) => mail.id === mail_id
  );
  if (!get_mail_from_received) {
    const get_mail_from_sent = get_user.sent_mails.find(
      (mail) => mail.id === mail_id
    );

    if (!get_mail_from_sent) return null;

    return get_mail_from_sent;
  }
  return get_mail_from_received;
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

// Change the wanted fields in mail.
const editDraft = (mail, title, content, draft) => {
  if (title) if (title.toString().trim() !== "") mail.title = title.toString();

  if (content)
    if (content.toString().trim() !== "") mail.content = content.toString();

  if (draft) if (draft.toString().toLowerCase() === "false") uploadDraft(mail);

  return;
};

module.exports = {
  getFiftyMails,
  createMail,
  getSpecificMail,
  deleteSpecificMail,
  getMailsByQuery,
  editDraft,
  getSpecificDraft,
};
