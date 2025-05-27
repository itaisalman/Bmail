const express = require("express");
const app = express();

const mails = require("./routes/mails");
const users = require("./routes/users");

app.use(express.json());
app.use("/api/mails", mails);
app.use("/api/users", users);

app.listen(3000);
