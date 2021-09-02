const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//Whenever someone connects this gets executed (см. в терминале)
// io.on('connection', function (socket) {
//   console.log('A user connected');

//1. Send a message to the client after a timeout of 4seconds
//   setTimeout(function () {
//     console.log('A user send message to the client');
//     socket.send('Sent a message 4seconds after connection!');
//   }, 4000);

//2. Sending an object when emmiting an event (testerEvent — our custom event)
//  setTimeout(function () {
// console.log('A user send message to the client');
//     socket.emit('testerEvent', {
//       description: 'A custom event named testerEvent!',
//     });
//   }, 4000);

//Whenever someone disconnects this piece of code executed (см. в терминале)
//   socket.on('disconnect', function () {
//     console.log('A user disconnected');
//   });
// });

//3. Чтобы обработать события c клиента, используйте функцию on объекта сокета на вашем сервере. Итак, теперь, если мы перейдем к localhost: 3000, мы получим пользовательское событие с именем clientEvent . Это событие будет обработано на сервере путем регистрации (см. в терминале после обновления браузера)
// io.on('connection', function (socket) {
//   socket.on('clientEvent', function (data) {
//     console.log(data);
//   });
// });

//4. Вещание означает отправку сообщения всем подключенным клиентам. Вещание может быть сделано на нескольких уровнях. Мы можем отправить сообщение всем подключенным клиентам, клиентам в пространстве имен и клиентам в определенной комнате. Чтобы передать событие всем клиентам, мы можем использовать метод io.sockets.emit .
// Примечание. Это отправит событие ВСЕМ подключенным клиентам (событие сокета, который мог запустить это событие).
// В этом примере мы передадим количество подключенных клиентов всем пользователям.
// let clients = 0;
// io.on('connection', function(socket) {
//    clients++;
//    io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
//    socket.on('disconnect', function () {
//       clients--;
//       io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
//    });
// });

//5. Давайте отправим новому пользователю приветственное сообщение и сообщим другим клиентам о его присоединении. Поэтому в вашем файле server.js при подключении клиента отправьте ему приветственное сообщение и передайте номер подключенного клиента всем остальным.
// let clients = 0;
// io.on('connection', function(socket) {
//    clients++;
//    socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
//    socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
//    socket.on('disconnect', function () {
//       clients--;
//       socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
//    });
// });

//6. Мы можем создать наши собственные пространства имен.Для чего нужно пространство имён? Основной ответ — для предотвращения конфликтов различных элементов кода (константы, функции, классы, ...), имеющих одинаковые имена, но находящихся в различных модулях. Чтобы настроить собственное пространство имен, мы можем вызвать функцию ‘of’ на стороне сервера —
// const nsp = io.of('/my-namespace');
// nsp.on('connection', function (socket) {
//   console.log('someone connected');
//   nsp.emit('hi', 'Hello everyone!');
// });

//7. В каждом пространстве имен вы также можете определить произвольные каналы, к которым сокеты могут присоединяться и выходить. Эти каналы называются комнатами. Номера используются для дальнейшего разделения проблем. Комнаты также имеют одно и то же сокетное соединение, что и пространства имен. При использовании комнат нужно помнить, что их можно объединять только на стороне сервера.
// Адаптер - это серверный компонент, который отвечает за широковещательную рассылку событий всем или некоторым клиентам. При масштабировании до нескольких серверов Socket.IO вам нужно будет заменить адаптер в памяти по умолчанию другой реализацией, чтобы события правильно маршрутизировались на всех клиентов.
// Соединяющиеся комнаты
// Вы можете вызвать метод соединения для сокета, чтобы подписать сокет на данный канал / комнату. Например, давайте создадим комнаты под названием room- <room-number> и присоединимся к некоторым клиентам. Как только эта комната заполнится, создайте другую комнату и присоединитесь к клиентам.
// Примечание. В настоящее время мы делаем это в пространстве имен по умолчанию, то есть «/». Вы также можете реализовать это в пользовательских пространствах имен таким же образом.
// Чтобы присоединиться к комнате, вам нужно указать имя комнаты в качестве аргумента для вызова функции соединения.
let roomno = 1;
io.on('connection', async function (socket) {
  console.log('A user connected');
  //   console.log(socket.rooms); // Set(1) { 'vh3g38d6NwPwz-9RAAAF' }

  const sockets = await io.fetchSockets();
  //   console.log(sockets.length);

  //Increase roomno 2 clients are present in a room.
  if (sockets.length > 2) {
    roomno++;
  }

  socket.join('room-' + roomno); // метод соединения для сокета, чтобы подписать сокет на данный канал / комнату.

  console.log(socket.rooms); // Set(2) { 'vh3g38d6NwPwz-9RAAAF', 'room-1' }

  //Send this event to everyone in the room.
  io.sockets
    .in('room-' + roomno)
    .emit('connectToRoom', 'You are in room no. ' + roomno);

  // Чтобы покинуть комнату, вам нужно вызвать функцию выхода так же, как вы вызывали функцию соединения в сокете.
  socket.on('disconnect', () => {
     
    console.log(sockets.length);
    console.log('User disconnected');
    socket.leave('room-' + roomno);
    console.log(sockets.length);
  });
});

http.listen(3000, function () {
  console.log(`listening on ${PORT}`);
});
