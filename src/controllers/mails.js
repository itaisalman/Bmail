const mails = require('../models/mails')
const blacklist = require('../models/blacklist')
const users = require('../models/users')
        
// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(user_id){
    return !(!user_id || isNaN(user_id));
}
        
// Check if the user id exists in the users list.
function checkIfExist(user_id){
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
function checkPostArguments({ receiver, title, content }){
    return !(!receiver || !title || !content || title.trim() === "" || content.trim() === "");   
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
function validationCheck(checked_id, req){
    if (!checkIfValid(checked_id)){
        return {statusCode: 400, error: 'Missing/Invalid user ID'}
    }
    const user_id = parseInt(req.headers['user']);
    if (!checkIfExist(user_id)){
        return {statusCode: 404, error: 'User not found'}
    }
    return null
}

// Generates the loops that checks the urls.
async function checkUrls(urls, concat) {
    for (const url of urls) {
        await checkUrlBlacklist(concat.concat(url));
    }
}

// Return the latest 50 mails from sent and received mails of user.
exports.getFiftyMails = (req, res) => {
    const returned_json = validationCheck(req.headers['user'], req);
    if (returned_json){
        return res.status(returned_json.statusCode).json({ error :returned_json.error });
    }
    const user_mails = mails.getFiftyMails(parseInt(req.headers['user']));
    res.json(user_mails);
}

// Create new mail using the arguments passed by the user.
// Add it to both sender and receiver mail boxes.
exports.addMail = async (req, res) => {
    const returned_json = validationCheck(req.headers['user'], req);
    if (returned_json){
        return res.status(returned_json.statusCode).json({ error :returned_json.error });
    }
    const { receiver, title, content } = req.body;
    // Check if required arguments passed.
    if (!checkPostArguments({ receiver, title, content })){
        return res.status(400).json({ error: 'Receiver, Title and Content is required or Invalid arguments' });
    }
    // Extract every url in title and content.
    const extracted_title = extractUrls(title);
    const extracted_content = extractUrls(content);
    let concat = "GET ";
    try {
        // Check if title or content contain bad url.
        await checkUrls(extracted_title, concat);
        await checkUrls(extracted_content, concat);

        // If all checks passed
        const created_mail = mails.createMail(parseInt(req.headers['user']), receiver, title, content);
        res.status(201).json(created_mail);
    } catch (err) {
        if (err.message === "BLACKLISTED") {
            return res.status(400).json({ error: 'Your title or content contain a BLACKLISTED URL !' });
        }
        return res.status(500).json({ error: 'Internal server error while checking blacklist' });
    }
};

// Delete a specific mail by its id.
exports.deleteMailById = (req, res) => {
    const returned_json = validationCheck(req.headers['user'], req);
    if (returned_json){
        return res.status(returned_json.statusCode).json({ error :returned_json.error });
    }
    // Search the mail in the user's mails.
    const deleted_mail = mails.deleteSpecificMail(parseInt(req.headers['user']), parseInt(req.params.id));
    if (!deleted_mail){
        return res.status(404).json({ error: 'Mail not found'});
    }
    res.status(204).end();
}    

// Return a mail by its id.
exports.getMailById = (req, res) => {
    const returned_json = validationCheck(req.headers['user'], req);
    if (returned_json){
        return res.status(returned_json.statusCode).json({ error :returned_json.error });
    }
    // Search the mail in the user's mails.
    const mail = mails.getSpecificMail(parseInt(req.headers['user']), parseInt(req.params.id));
    res.status(200).json(mail);
}

// Search for all the mails that contain query.
// Return an array of all the mails answer the requirement.
exports.searchMails = (req, res) => {
    const returned_json = validationCheck(req.headers['user'], req);
    if (returned_json){
        return res.status(returned_json.statusCode).json({ error :returned_json.error });
    }
    const query = req.params.query;
    const result = mails.getMailsByQuery(parseInt(req.headers['user']), query);
    res.status(200).json(result);
}