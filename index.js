const net = require('net');
const fs = require('fs')

const host = 'localhost'
const port = 3000;

/* create server */
const server = net.createServer(function(socket) {
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => {

    /* get fileName from data */
    let fileName = chunk.toString();
    fileName = fileName.split(' ')[1];
    fileName = fileName.split('/')[1];

    /* get url path from data */
    const urlPath = chunk.split(' ')[1];

    /* read file and serve it using fs  */
    fs.readFile(`./public/${fileName}`, function(error, data) {
      if(error) {
        console.log('throw error ', error);
        const errorResponse = `HTTP/1.1 404 Not Found\n Content-Length: ${error.length}\n Content-Type: text/html\n\n`;

        socket.write(errorResponse);
      }
      else {
        console.log('else > data: ', data);
        socket.write(`HTTP/1.1 200 OK\n Content-Length: ${data.length}\n Content-Type: image/jpeg\r\n`);
        socket.write(data);
      }
    })
    /* log url path and file name to console */
    console.log('urlPath and filename: ', urlPath, fileName);
    return fileName
  })

  socket.on('end', () => {
    console.log('client disconnected');
  });

  const response = `HTTP/1.1 200 OK\n Content-Type: image/jpeg\n\n`;

  socket.write(response);
  socket.pipe(socket);
});

server.on('error', (err) => {
  console.log('throw error', err);
  throw err;
});

server.listen(port,  () => {
  console.log(`Server is listening at http://${host}/${port}`);
});