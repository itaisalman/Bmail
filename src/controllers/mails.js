const mails = require('../models/mails')

exports.getFiftyMails = (req, res) => {
    res.json(mails.getFiftyMails())
}