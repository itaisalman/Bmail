// Import the 'net' module to create TCP client connections
const net = require("net");

// Export a function that connects to the Bloom Filter server
// 'text' is the message to send, 'callback' handles the response or error
exports.connectToBloomFilterServer = (text, callback) => {
  // Define the host and port of the C++ server
  const HOST = "cpp-server";
  const PORT = "8080";

  // Create a new TCP socket
  const client = new net.Socket();

  let response = "";

  // When the client successfully connects to the server, send the input text followed by a newline character
  client.connect(PORT, HOST, () => {
    client.write(text + "\n");
  });

  // When data is received from the server, append the received chunk to the response string
  client.on("data", (chunk) => {
    response += chunk.toString();
    // Close the connection after receiving the data
    client.end();
  });

  // When the connection is fully closed, call the callback with the full response (no error)
  client.on("end", () => {
    callback(null, response);
  });

  // If an error occurs during connection or communication, call the callback with the error (no response)
  client.on("error", (err) => {
    callback(err, null);
  });
};
