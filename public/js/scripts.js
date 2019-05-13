$(function () {
  var socket = io();
  var notyf = new Notyf();

  var previous_connection = false;
  var tiles_loaded = false;
  var user_money = 0;

  socket.on('user_connect', function(msg) {
    notyf.success(msg.id + " connected.");
    $('#connected').html(msg.connected)
  });

  socket.on('user_disconnect', function(msg) {
    notyf.error(msg.id + " disconnected.");
    $('#connected').html(msg.connected);
    $("#"+msg.id).remove();
  });

  socket.on('tick', function(data) {
    var clients = data.users;
    user_money = clients[socket.id].money;
    $('#money').text(user_money);
  });

  socket.on('user_error', function(data) {
    notyf.error(data.message);
  });

  socket.on('tiles', function(tiles) {
    if(tiles_loaded) {
    } else {
      console.log(tiles);
      for(var key in tiles) {
        var tile = $('<div id="'+tiles[key].id+'" class="tile grass"></div>');
        tile.css("background-color", "#" + tiles[key].user.colour);
        $("#area").append(tile);
      }
      tiles_loaded = true;
      $( ".tile" ).click(function() {
        if(user_money >= 10) {
          socket.emit('user_click', { tile: $(this).attr('id') });
          user_money = user_money - 10;
          moneyUpdate();
        } else {
          notyf.error("Not enough money!");
        }
      });
    }
  });

  socket.on('tile', function(tile) {
    console.log(tile);
      $("#" + tile.id).css("background-color", "#" + tile.user.colour);
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


function moneyUpdate() {
  $('#money').text(user_money);
}

});