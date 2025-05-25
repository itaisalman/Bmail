const express = require("express");
const app = express();

const labels = require("./routes/labels");
const mails = require("./routes/mails");

app.use(express.json());
app.use("/api/mails", mails);
app.use("/api/labels", labels);

app.listen(8080);
