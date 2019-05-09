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
    money++;
    $('#money').text(money.toFixed(2));
  });

  socket.on('user_click', function(msg) {
    console.log(msg.tile);
    $("#" + msg.tile).addClass("clicked");
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
    var pos = $(this).position();
    socket.emit('user_click', { id: socket.id, tile: $(this).attr('id') });
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
