const http = require('http');
const routes = require('./section_3/routes');

// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method, req.headers);
//     process.exit();
// });

console.log(routes.someText);

const server = http.createServer(routes.handler);

server.listen(3000);