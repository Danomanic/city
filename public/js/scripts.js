$(function () {
  var socket = io();
  var notyf = new Notyf();

  var previous_connection = false;
  var tiles_loaded = false;
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

  socket.on('user_click', function(data) {
    console.log(data);
    if(data.status == 1) {
      $("#" + data.tile).css("background-color", "#" + data.colour);
    } else {
      notyf.error("Unable to purchase area.");
    }
  });

  socket.on('tiles', function(tiles) {
    if(tiles_loaded) {
    } else {
      for(var key in tiles) {
        var tile = $('<div id="'+tiles[key].id+'" class="tile grass"></div>');
        $("#area").append(tile);
      }
      tiles_loaded = true;
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

  $( ".tile" ).click(function() {
    if(money >= 10) {
      socket.emit('user_click', { tile: $(this).attr('id') });
      updateMoney(-10);
    } else {
      notyf.error("Not enough money!");
    }
  });

});

function moneyUpdate(amount) {
  money = money + amount;
  $('#money').text(money);
}
