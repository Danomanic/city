var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedClients = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  userConnect(socket);

  socket.on('user_click', function(data){
    io.emit('user_click', {id: socket.id, tile: data.tile });
  });

  socket.on('disconnect', function(){
    userDisconnect(socket);
  });
});

const tick = () => {
  try {
    io.emit('tick');
  }
  catch {
    log("Unable to tick.");
  }
}

const userConnect = async (socket) => {
  try {
    connectedClients[socket.id] = socket;
    io.emit('user_connect', { id: socket.id, connected: clientsNum() });
    log("User Connected.", socket.id);
  }
  catch {
    log("Unable to broadcast user_connect.", socket.id);
  }
}

const userDisconnect = async (socket) => {
  try {
    delete connectedClients[socket.id];
    io.emit('user_disconnect', { id: socket.id, connected: clientsNum() });
    log("User Disconnected", socket.id);
  }
  catch {
    log("Unable to broadcast user_disconnect.", socket.id);
  }
}

const log = async (message, id = null) => {
  var date = new Date();
  console.log(formatDate(date) + " | " + (id ? id : "Server").padEnd(20) + " | " + message);
}

const formatDate = (date) => {
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return [year, month, day].join('-') + " " + [hour, min, sec].join(':');
}

const clientsNum = () => {
  return Object.keys(connectedClients).length;
}


http.listen(8080, function(){
  log('Listening on *:8080');
});

app.use(express.static('public'));

var intervalID = setInterval(tick, 1000);
