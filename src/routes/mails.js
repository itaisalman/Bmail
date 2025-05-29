const express = require('express')
var router = express.Router()
const controller = require('../controllers/mails')

router.route('/')
        .get(controller.getFiftyMails)

router.route('/:id')
        .get(controller.getMail)
module.exports = router