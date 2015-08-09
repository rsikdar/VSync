var app = require('express')();
require('ejs');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use(session({
// 	cookieName: 'session',
// 	secret: 'qwerty',

// }));
var all_rooms = [];
// var all_users = [];
// var users_typing = [];
// var users_text_entered = [];
peopleReady = 0;
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/main.html');
});


app.get('/cards.html', function(req, res) {
	// console.log(req.query);
	var id = req.query['rId'];
	var roomId = id.substring(0,8);
	var videoId = id.substring(8);
	// videoId = req.query['vId'];
	 // {rId:roomId, vId: videoId}
	res.render(__dirname + '/cards.html', {rId:roomId, vId: videoId});
});

app.get('/search.html', function(req, res) {
	// console.log(req.query);
	var query = req.query['q'];
	// var roomId = id.substring(0,8);
	// var videoId = id.substring(8);
	// videoId = req.query['vId'];
	 // {rId:roomId, vId: videoId}
	res.render(__dirname + '/search.html', {q:query});
});

app.get('/*.js', function(req, res) {
    res.sendFile(__dirname + req.url);
});

app.get('/*.css', function(req, res) {
    res.sendFile(__dirname + req.url);
});

app.all('*', function(req, res) {
	// console.log('wft');
    res.sendFile(__dirname + req.url);
});


io.on('connection', function(socket){
	socket.on('chat message', function(msg, username){
		// console.log('chat message reached');
		io.emit('chat message', msg, username);
	});
	socket.on('connected', function(data){

		socket.room = data[2];
		socket.join(socket.room);
		var room;
		if (all_rooms[socket.room] === undefined) {
			all_rooms[socket.room] = new Array();
			room = all_rooms[socket.room]
			room.users_typing = new Array();
			room.users_text_entered = new Array();
			room.all_users = new Array();
			// room.all_sockets = new Array();
		} else {
			room = all_rooms[socket.room]
		}

		room.all_users.push(data[0]);
		// room.all_sockets.push(socket);

		var req = socket.request;
		req.user = data[0];
		// all_users.push(data[0]);
		io.sockets.in(socket.room).emit('sync', room.all_users[0], data[0]);
		io.sockets.in(socket.room).emit('connect and disconnect', data[1], data[0], room.all_users);
	});

	socket.on('getTime', function(){
		timeOfServerReach = new Date().getTime();
		socket.emit('returnTime', [timeOfServerReach, new Date().getTime()]);
	})

	socket.on('disconnect', function(){
		room = all_rooms[socket.room];
		if (room != undefined) {
			var index1 = room.all_users.indexOf(socket.request.user);
			var index2 = room.users_typing.indexOf(socket.request.user);
			var index3 = room.users_text_entered.indexOf(socket.request.user);
			room.all_users.splice(index1, 1);
			room.users_typing.splice(index2, 1);
			room.users_text_entered.splice(index3, 1);
		}
		// io.emit('connect and disconnect', socket.request.user + ' has disconnected', all_users);
		// io.to(socket.room).emit('text_entered', users_text_entered, users_typing);
	});

	// socket.on('typing', function(user){
	// 	if (users_typing.indexOf(user) < 0) {
	// 		users_typing.push(user);
	// 		io.to(socket.room).emit('typing', users_typing);
	// 	}
	// });

	// socket.on('text_entered', function(user){
	// 	if (users_text_entered.indexOf(user) < 0) {
	// 		users_text_entered.push(user);
	// 		var index = users_typing.indexOf(user);
	// 		if (index >= 0) {
	// 			users_typing.splice(index, 1);
	// 		}
	// 		io.to(socket.room).emit('text_entered', users_text_entered, users_typing);
	// 	}
	// });

	// socket.on('text_entered_remove', function(user){
	// 	var index = users_text_entered.indexOf(user);
	// 	if (index >= 0) {
	// 		users_text_entered.splice(index, 1);
	// 		io.to(socket.room).emit('text_entered', users_text_entered,users_typing);
	// 	}
	// });

	// socket.on('typing_remove', function(user){
	// 	var index = users_typing.indexOf(user);
	// 	if (index >= 0) {
	// 		users_typing.splice(index, 1);
	// 		io.to(socket.room).emit('typing', users_typing);
	// 	}
	// });



	// socket.on('join', function(time) {
	// 	var delay = (new Date()).getTime() - time;
	// 	user = new Array();
	// })
	//

	// socket.on('createRoom', function(videoId) {
	// 	//create room
	// 	//send back user a url containing the room id,
	// 	//and the video id as parameters
	// 	//on load make the page parse the params and laod the correct video
	// 	var roomId = 'test1';
	// 	var url = __dirname + '/cards.html?' + 'rId=' + roomId + '&vId=' _ videoId;

	// }




	socket.on('play', function(user, videoTime){

		// setTimeout(
		// 	function() {
				var time = new Date().getTime();
				// console.log(time, 'backend start time');
				io.to(socket.room).emit('hostStart', time + 600, videoTime);
			// }, 300);
	});

	socket.on('pause', function(videoTime, user){
		// console.log(user, 'back end');
		// setTimeout(
		// 	function() {
		io.to(socket.room).emit('hostStop', videoTime, user);
		// }, 100);
	});

	socket.on('ready', function(user){
		peopleReady++;
		if (peopleReady % 2 === 0) {

			setTimeout(function() {
				var time = new Date().getTime();
				io.to(socket.room).emit('firstStart', time + 1300);
			}, 1000);
		}
	});

});

http.listen(8081, function(){
	console.log('listening on port 8081');
});