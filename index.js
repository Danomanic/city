var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
global.io = io;

var user = require('./user');

var log = require('./utils/log.js');
global.log = log;

var users = {};
global.users = users;

var tiles = {};
global.tiles = tiles;

var port = process.env.PORT || 5000

io.on('connection', function(socket){
  user.connect(socket);

  socket.on('user_click', function(data){
    user.click(socket, data);
  });

  socket.on('disconnect', function(){
    user.disconnect(socket);
  });
});

const tick = () => {
  try {
    for(var key in users) {
      users[key].money++;
    }
    io.emit('tick', { clients : users });
    io.emit('tiles', tiles);
  }
  catch {
    log.info("Unable to tick.");
  }
}


http.listen(port, function(){
  log.info('Listening on *:'+port);
});

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


var intervalID = setInterval(tick, 1000);

for (var x = 1; x < 21; x++) {
  for (var y = 1; y < 21; y++) {
    var tile;
    var id = "tile_"+x+"_"+y;
    tile = { id: id, user: null }
    tiles[id] = tile;
  }
}
