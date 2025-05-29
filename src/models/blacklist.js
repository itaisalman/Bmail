const net = require("net");

exports.connectToBloomFilterServer = (text, callback) => {
  const HOST = "cpp-server";
  const PORT = "8080";
  const client = new net.Socket();
  const url = extractUrls(text);
  if (!url) {
    return false;
  }
  let respone = "";
  let command = "GET";

  client.connect(PORT, HOST, () => {
    const payload = `${command} ${url}`;
    client.write(payload + "\n");
  });
  client.on("data", (chunk) => {
    respone += chunk.toString();
    client.end;
  });

  client.on("end", () => {
    callback(null, respone);
  });

  client.on("error", (err) => {
    callback(err, null);
  });
};
