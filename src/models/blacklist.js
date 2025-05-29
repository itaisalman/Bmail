const net = require("net");

exports.connectToBloomFilterServer = (text, callback) => {
  const HOST = "cpp-server";
  const PORT = "8080";
  const client = new net.Socket();

  let response = "";

  client.connect(PORT, HOST, () => {
    client.write(text + "\n");
  });
  client.on("data", (chunk) => {
    response += chunk.toString();
    client.end();
  });

  client.on("end", () => {
    callback(null, response);
  });

  client.on("error", (err) => {
    callback(err, null);
  });
};
