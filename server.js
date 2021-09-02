const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function (socket) {
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

http.listen(3000, function () {
  console.log(`listening on ${PORT}`);
});
