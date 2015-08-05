
var user = prompt("please enter name:");
var username = user;
var socket = io();
socket.emit('connected', [user, '>>> ' + user + ' has connected']);
socket.on('hostStart', function(time, user, videoTime) {

    // console.log('should start');

    // var play = $('#player');
    // console.log(player);
    // console.log('response ' + time);
    // player.playVideo();
    console.log(new Date().getTime(), "time of reach")
    console.log(time, 'to play at');
    // if (user != username) {


    // 	// player.pauseVideo();
    // }
    player.seekTo(videoTime - 1, true);
    player.seekTo(videoTime, true);
    setTimeout(playVideo, time - new Date().getTime());

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
    player.seekTo(videoTime - 1, true);
    player.seekTo(videoTime, true);

});