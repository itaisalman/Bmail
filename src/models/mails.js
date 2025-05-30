let mail_counter = 0;
const users = require('./users')

// Find the recent 50 mails who have been sent or received by that user.
// Using two pointers to the bottom of each array and comparing their dates.
// Add the most recent mail to the top of the mails array, so that the array will be in descending order.
function findFiftyMails(get_user){
    const fifty_mails_array = [];
    let inbox_index = get_user.received_mails.length - 1;
    let sent_index = get_user.sent_mails.length - 1;
    // Add 50 mails (if there are 50 mails sent or received) to the array by comparing the date. 
    while (fifty_mails_array.length < 50 && (inbox_index >= 0 || sent_index >= 0)){
        const inbox_mail = inbox_index >= 0 ? get_user.received_mails[inbox_index] : null;
        const sent_mail = sent_index >= 0 ? get_user.sent_mails[sent_index] : null;
        // Latest mails gets priority.
        if (inbox_mail && (!sent_mail || inbox_mail.date > sent_mail.date)) {
            fifty_mails_array.push(inbox_mail);
            inbox_index--;
        } else if (sent_mail) {
            fifty_mails_array.push(sent_mail);
            sent_index--;
        }
    }
    return fifty_mails_array;
}

const getFiftyMails = (user_id) => {
    // Return null if this user_id does not exist.
    const get_user = users.getUserById(user_id);
    if (!get_user){
        return null;
    }
    return findFiftyMails(get_user);
}

// Create a new mail
// Define its properties and add them to both sender and receiver.
const createMail = (sender, receiver, title, content) => {
    const new_mail = {
        id: ++mail_counter,
        sender: sender,
        receiver: receiver,
        title: title,
        content: content,
        date: new Date()
    };
    users.getUserById(sender).sent_mails.push(new_mail);
    users.getUserById(receiver).received_mails.push(new_mail);
}

const getSpecificMail = (user_id, mail_id) => {
    // Return null if this user_id does not exist.
    const get_user = users.getUserById(user_id);
    // Check if the mail is in received or in sent.
    // If not in both, return null.
    const get_mail_from_received = get_user.received_mails.find((mail) => mail.id === mail_id);
    if (!get_mail_from_received){
        const get_mail_from_sent = get_user.sent_mails.find((mail) => mail.id === mail_id);
        if (!get_mail_from_sent){
            return null;
        }
        return get_mail_from_sent; 
    }
    return get_mail_from_received;
}


module.exports = {
    getFiftyMails,
    createMail,
    getSpecificMail
}