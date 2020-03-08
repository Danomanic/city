/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(() => {
  const socket = io();
  const notyf = new Notyf();

  let previousConnection = false;
  let userMoney = 0;

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumSignificantDigits: 4,
  });

  function moneyUpdate() {
    $('#money').text(formatter.format(userMoney));
  }

  socket.on('user_connect', (msg) => {
    notyf.success(`${msg.id} connected.`);
    $('#connected').html(msg.connected);
  });

  socket.on('user_disconnect', (msg) => {
    notyf.error(`${msg.id} disconnected.`);
    $('#connected').html(msg.connected);
    $(`#${msg.id}`).remove();
  });

  socket.on('tick', (data) => {
    userMoney = data.users[socket.id].money;
    moneyUpdate();
    $('#users').html('');
    for (const key in data.users) {
      const user = $(`<li>${data.users[key].id} ($${data.users[key].money})</li>`);
      user.css('color', `#${data.users[key].colour}`);
      $('#users').append(user);
    }
  });

  socket.on('user_error', (data) => {
    notyf.error(data.message);
  });

  socket.on('welcome', (data) => {
    console.log(data);
    for (const key in data.tiles) {
      console.log(data);
      const tile = $(`<div id="${data.tiles[key].id}" class="tile grass"></div>`);
      tile.css('background-color', `#${data.tiles[key].user.colour}`);
      $('#area').append(tile);
    }

    $('.tile').click(function () {
      if (userMoney >= 10) {
        socket.emit('user_click', { tile: $(this).attr('id') });
      } else {
        notyf.error('Not enough money!');
      }
    });

    $('#devtool_reset').click(function () {
      socket.emit('devtool_reset');
      notyf.success('Database Reset');
      location.reload();
    });

    $('#version').text(data.version);
  });

  socket.on('tile', (tile) => {
    $(`#${tile.id}`).css('background-color', `#${tile.user.colour}`);
    if (tile.user.id === socket.id) {
      userMoney = tile.user.money;
      moneyUpdate();
    }
  });

  socket.on('connect', () => {
    if (previousConnection === true) {
      location.reload();
    } else {
      notyf.success('Server connected.');
    }
  });

  socket.on('disconnect', () => {
    previousConnection = true;
    notyf.error('Server disconnected.');
  });
});
