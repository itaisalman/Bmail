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

module.exports = {
    getFiftyMails
}