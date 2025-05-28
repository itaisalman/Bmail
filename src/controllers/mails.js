const mails = require('../models/mails')

exports.getFiftyMails = (req, res) => {
    const user_id = parseInt(req.headers['user']);
    // Check if user_id is given.
    if (!user_id){
        return res.status(404).json({ error: 'Missing ID'})
    }
    const user_mails = mails.getFiftyMails(user_id);
    // Check if the user_id given exists.
    if (!user_mails){
        return res.status(404).json({ error: 'User ID not found'})
    }
    res.json(user_mails);
}