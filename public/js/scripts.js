$(function () {
  var socket = io();
  var notyf = new Notyf();

  var previous_connection = false;
  var money = 0;

  socket.on('user_connect', function(msg) {
    notyf.success(msg.id + " connected.");
    $('#connected').html(msg.connected)
  });

  socket.on('user_disconnect', function(msg) {
    notyf.error(msg.id + " disconnected.");
    $('#connected').html(msg.connected);
    $("#"+msg.id).remove();
  });

  socket.on('tick', function(msg) {
    var clients = msg.clients;
    money = clients[socket.id].money;
    $('#money').text(money);
  });

  socket.on('user_money', function(data) {
    money = data;
    $('#money').text(money);
  });

  socket.on('user_click', function(data) {
    console.log(data);
    if(data.status == 1) {
      $("#" + data.tile).css("background-color", "#" + data.colour);
    } else {
      notyf.error("Unable to purchase area.");
    }
  });

  socket.on('connect', function () {
    if(previous_connection == true) {
      location.reload();
    } else {
      notyf.success("Server connected.");
    }
  });

  socket.on('disconnect', function () {
    previous_connection = true;
    notyf.error("Server disconnected.");
  });

  loadTiles();

  $( ".tile" ).click(function() {
    if(money >= 10) {
      socket.emit('user_click', { tile: $(this).attr('id') });
    } else {
      notyf.error("Not enough money!");
    }
  });

});

function loadTiles() {
  console.log("Loading tiles...");

  for (var x = 1; x < 21; x++) {
    for (var y = 1; y < 21; y++) {
      var tile = $('<div id="tile_'+x+'_'+y+'" class="tile grass"></div>');
      $("#area").append(tile);
    }
  }

}
