const express = require("express");
const path = require("path");
const app = express();

const mails = require("./routes/mails");
const users = require("./routes/users");
const tokens = require("./routes/tokens");
const labels = require("./routes/labels");
const blacklist = require("./routes/blacklist");

app.use(express.json());
app.use("/api/mails", mails);
app.use("/api/users", users);
app.use("/api/tokens", tokens);
app.use("/api/labels", labels);
app.use("/api/blacklist", blacklist);
app.use("/upload", express.static(path.join(__dirname, "../data/upload")));

app.listen(3000);
