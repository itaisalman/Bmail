const express = require('express')
const app = express()

const mails = require('./routes/mails');

app.use(express.json())
app.use('/api/mails', mails);


app.listen(8080)