const express = require("express");
const app = express();

const mails = require("./routes/mails");
const users = require("./routes/users");
const tokens = require("./routes/tokens");
const labels = require("./routes/labels");

app.use(express.json());
app.use("/api/mails", mails);
app.use("/api/users", users);
app.use("/api/tokens", tokens);
app.use("/api/labels", labels);

app.listen(3000);
