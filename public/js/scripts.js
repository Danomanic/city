$(function () {
  var socket = io();
  var previous_connection = false;
  var money = 0;

  socket.on('user_connect', function(msg) {
    $('#console').append($('<li>').text(msg.id + " connected."));
    var player = $('<div id="' + msg.id + '" class="player"></div>');
    //$('body').append(player);
  });

  socket.on('user_disconnect', function(msg) {
    $('#console').append($('<li>').text(msg.id + " disconnected."));
    $("#"+msg.id).remove();
  });

  socket.on('tick', function(msg) {
    money++;
    $('#money').text("$" + money.toFixed(2));
  });

  socket.on('user_move', function(msg) {
    console.log("client move");
    $("#"+ msg.id).animate({
          top: msg.top,
          left: msg.left + 20
    }, 1000 );
  });

  socket.on('connect', function () {
    if(previous_connection == true) {
      location.reload();
    } else {
      $('#console').append($('<li>').text("Server connected."));
    }
  });

  socket.on('disconnect', function () {
    previous_connection = true;
    $('#console').append($('<li>').text("Server disconnected."));
  });

  loadTiles();

  $( ".tile" ).click(function() {
    console.log("Click");
    var pos = $(this).position();
    socket.emit('user_move', { id: socket.id, top: pos.top, left: pos.left });
  });

});

function loadTiles() {
  console.log("Loading tiles...");

  for (var i = 2; i < 12; i++) {
    var x = i * 50;
    for (var j = 0; j < 10; j++) {
      var y = j * 44;
      var tile = $('<div class="tile grass" style="transform: rotate(210deg) skew(-30deg) translate(-' + x + 'px, ' + y + 'px) scaleY(0.864);">' + x + 'x' + y + '</div>');
      //$("#area").append(tile);
    }
  }

}
