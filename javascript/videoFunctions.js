var user = prompt("Bitch Identification:");
var params = getJsonFromUrl();
var username = user;
var socket = io();
var clientSend = new Date().getTime();
var timeToAdd = 0;
socket.emit('connected', [user, '>>> ' + user + ' has connected', params.rId]);
socket.on('returnTime', function(data) {
    console.log(username);
    var clientReach = new Date().getTime();
    var serverReach = data[0];
    var serverSend = data[1];
    var roundTripTime = clientReach - clientSend - (serverSend - serverReach);
    var timeToServer = roundTripTime * 0.5;
    timeToAdd = timeToServer + serverSend - clientReach;

})
socket.on('hostStart', function(time, videoTime) {

    // console.log('should start');

    // var play = $('#player');
    // console.log(player);
    // console.log('response ' + time);
    // player.playVideo();
    // console.log(new Date().getTime(), "time of reach")
    // console.log(time, 'to play at');
    console.log(timeToAdd, 'delay');
    // if (user != username) {


    // 	// player.pauseVideo();
    // }
    // player.seekTo(videoTime - 1, true);
    // player.seekTo(videoTime, true);
    setTimeout(playVideo, time - new Date().getTime() + timeToAdd);

});

socket.on('firstStart', function(time) {

    // console.log('should start');

    // var play = $('#player');
    // console.log(player);
    // console.log('response ' + time);
    // player.playVideo();
    // console.log(user, username, 'play');
    // if (user != username) {
    // 	playVideo();
    // 	pauseVideo();
    // 	// player.pauseVideo();
    // }
    setTimeout(playVideo, time - new Date().getTime());

});

// socket.on('hostStart', function(time) {
//     // console.log('should start');

//     // var play = $('#player');
//     // console.log(player);
//     // console.log('response ' + time);
//     // player.playVideo();
//     setTimeout(playVideo, time - new Date().getTime());

// });


socket.on('hostStop', function(videoTime, user) {
    // console.log('should stop');
    // console.log(user, username);
    if (user != username) {
	    // ignore = true;
	    // console.log('ignoring this pause');
	    // player.pauseVideo();
	    pauseVideo();
    }
    //youtube doesnt restart second if you call seek to on the second its at (i think)
    player.seekTo(videoTime - 1, true);
    player.seekTo(videoTime, true);

});
