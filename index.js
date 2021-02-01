const app = require("./app");
const http = require("http");

server = http.createServer(app);

server.listen(3001, () => {
  console.log("Listening on port 3001");
});