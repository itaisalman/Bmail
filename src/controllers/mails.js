const mails = require('../models/mails')
const blacklist = require('../models/blacklist')
const users = require('../models/users')

// Checks if the user_id given is valid (is a number, and is existing)
function checkIfValid(user_id){
    if (!user_id){
        return false;
    }
    if (!users.getUserById(user_id)){
        return false;
    }
    return true;
}

exports.getFiftyMails = (req, res) => {
    const user_id = parseInt(req.headers['user']);
    // Check if user_id is given.
    if (!checkIfValid(user_id)){
        return res.status(400).json({ error: 'Missing/Invalid user ID or User not found'})
    }
    const user_mails = mails.getFiftyMails(user_id);
    res.json(user_mails);
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
    if (!receiver || !title || !content || title.trim() === "" || content.trim() === ""){
        return false;
    }
    return true;
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

// Generates the loops that checks the urls.
async function checkUrls(urls, concat) {
    for (const url of urls) {
        await checkUrlBlacklist(concat.concat(url));
    }
}

exports.addMail = async (req, res) => {
    const user_id = parseInt(req.headers['user']);
    if (!checkIfValid(user_id)){
        return res.status(400).json({ error: 'Missing/Invalid user ID or User not found'})
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
        const created_mail = mails.createMail(user_id, receiver, title, content);
        res.status(201).json(created_mail);
    } catch (err) {
        if (err.message === "BLACKLISTED") {
            return res.status(400).json({ error: 'Your title or content contain a BLACKLISTED URL !' });
        }
        return res.status(500).json({ error: 'Internal server error while checking blacklist' });
    }
};

exports.getMailById = (req, res) => {
    const user_id = parseInt(req.headers['user']);
    console.log(user_id);
    // Check if user_id is valid.
    if (!checkIfValid(user_id)){
        return res.status(400).json({ error: 'Missing/Invalid user ID or User not found'})
    }
    // Search the mail in the user's mails.
    const mail = mails.getSpecificMail(user_id, parseInt(req.params.id));
    if (!mail){
        return res.status(404).json({ error: 'Mail not found'})
    }
    res.json(mail);
}