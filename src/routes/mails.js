const express = require('express')
var router = express.Router()
const controller = require('../controllers/mails')

router.route('/')
        .get(controller.getFiftyMails)
module.exports = router