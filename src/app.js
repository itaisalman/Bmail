const express = require("express");
const path = require("path");
const app = express();
const middleware = require("./middleware/auth");
require("dotenv").config({ path: path.join(__dirname, "../config/.env") });

const mails = require("./routes/mails");
const users = require("./routes/users");
const tokens = require("./routes/tokens");
const labels = require("./routes/labels");
const blacklist = require("./routes/blacklist");

app.use(express.json());
app.use("/api/mails", middleware.isLoggedIn, mails);
app.use("/api/users", users);
app.use("/api/tokens", tokens);
app.use("/api/labels", middleware.isLoggedIn, labels);
app.use("/api/blacklist", middleware.isLoggedIn, blacklist);
app.use("/upload", express.static(path.join(__dirname, "../data/upload")));

app.listen(3000);
