const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
  console.log(`listening on ${PORT}`);
});
