$(function () {
  var socket = io();
  var notyf = new Notyf();

  var previous_connection = false;
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
    user_money = data.users[socket.id].money;
    $('#money').text(user_money);
    $('#users').html("");
    for(var key in data.users) {
      var user = $('<li>'+data.users[key].id+' ($'+data.users[key].money+')</li>');
        user.css("color", "#" + data.users[key].colour);
        $("#users").append(user);
    }
  });

  socket.on('user_error', function(data) {
    notyf.error(data.message);
  });

  socket.on('welcome', function(data) {
      for(var key in data.tiles) {
        var tile = $('<div id="'+data.tiles[key].id+'" class="tile grass"></div>');
        tile.css("background-color", "#" + data.tiles[key].user.colour);
        $("#area").append(tile);
      }
      
      $( ".tile" ).click(function() {
        if(user_money >= 10) {
          socket.emit('user_click', { tile: $(this).attr('id') });
        } else {
          notyf.error("Not enough money!");
        }
      });

      $("#version").text(data.version);
  });

  socket.on('tile', function(tile) {
    $("#" + tile.id).css("background-color", "#" + tile.user.colour);
    if(tile.user.id == socket.id) {
      user_money = tile.user.money;
      moneyUpdate();
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


function moneyUpdate() {
  $('#money').text(user_money);
}

});