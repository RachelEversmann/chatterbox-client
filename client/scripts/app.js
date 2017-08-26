var App = function(url) {
  this.apiUrl = url;
  this.username = '';
  this.currentRoom;
  this.messages = [];
  this.data;
  this.friends = [];
};

App.prototype.setUser = function (username) {
  this.username = username;
};

App.prototype.init = function() {
  var context = this;
  setInterval(function() { context.getMessagesForChannel(); }, 5000);
};

App.prototype.send = function (message) {
  var messageObj = { 'username': this.username, 'text': message, 'roomname': this.currentRoom };
  $.ajax({
    url: this.apiUrl,
    type: 'POST',
    context: this,
    data: messageObj,
    success: function () {
      alert('message sent');
    },
    error: function () {
      alert('message not sent :( ');
    }
  });
};

App.prototype.fetch = function() {

  $.ajax({
    url: this.apiUrl,
    type: 'GET',
    context: this,
    data: { order: '-createdAt' },
    success: function (data) {
      console.log('Message received', data);
      this.data = data;
    },
    error: function (data) {
      console.error('fetch failed :( ', data);
    }
  });
};

App.prototype.clearMessages = function () {
  $('#chats').html('');

};

App.prototype.renderMessage = function (messageObj) {
  var username = messageObj.username;
  var message = messageObj.text;
  var timeStamp = messageObj.updatedAt;
  if (app.friends.includes(username)) {
    message = '<b>' + message + '</b>';
  }
  if (!username.includes('<') && !message.includes('<') && !timeStamp.includes('<')) {
    timeStamp = moment(timeStamp).startOf('day').fromNow();
    $('#chats').prepend('<div class = "messageBox">' +
                        '<div class="text">' + message + '</div>' +
                        '<div class = "user"> <a href = "#">' + username + '</a> </div>' +
                        '<div class = "timeStamp">' + timeStamp + '</div>' +
                      '</div>'
    );
  }
  $( '.user' ).bind( 'click', function() {
    app.friends.push($(this).text());
  });
};

App.prototype.getMessagesForChannel = function () {
  var context = this;
  $.ajax({
    url: this.apiUrl,
    type: 'GET',
    context: this,
    data: { order: '-createdAt' },
    success: function (data) {
      $('#chats').html('');
      data.results.reverse();
      data.results.forEach(function(message) {
        if (message.roomname && !message.roomname.includes('<')) {
          if (message.roomname === context.currentRoom) {
            context.renderMessage(message);
          }
        }
      });
    },
    error: function (data) {
      console.error('fetch failed :( ', data);
    }
  });
};

App.prototype.renderRoom = function (room) {
  $('#roomSelect').append('<option>' + room + '</option>');
};

var app = new App('http://parse.atx.hackreactor.com/chatterbox/classes/messages');
