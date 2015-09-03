var user = prompt("Bitch Identification:");
var params = getJsonFromUrl();
var username = user;
var socket = io();
var clientSend;
var timeToAdd = 0;
// var listOfTimes = new Array();
var id = params.rId;
var roomIdHash = id.substring(0,9);
var hashids = new Hashids("ryan is a bitch", 9);
var roomId = hashids.decode(roomIdHash)[0];
// console.log(roomId, 'roomid');
startTimeDiffCheck();
function startSync() {
    socket.emit('connected', [username, '>>> ' + username + ' has connected', roomId]);
}
function startTimeDiffCheck(){
    clientSend = new Date().getTime();
    socket.emit('getTime');
}
socket.on('returnTime', function(data) {
    // console.log(username);
    var clientReach = new Date().getTime();
    var serverReach = data[0];
    var serverSend = data[1];
    var roundTripTime = clientReach - clientSend - (serverSend - serverReach);
    var timeToServer = roundTripTime * 0.5;
    timeToAdd = timeToServer + serverSend - clientReach;
    // listOfTimes.push(timeToAdd);
    // console.log('clientSend, serverReach, serverSend, clientReach')
    // console.log(clientSend, serverReach, serverSend, clientReach);
    // console.log(timeToAdd);
    // update and regularize the time to add
    //

});
socket.on('sync', function(userToPause, userJoined) {
    console.log('syncing attempt')
    //replace html and show status bar
    if (userToPause == userJoined) {
        //first person in lobby then
        console.log('no sync needed');
        return;
    }
    if (username == userJoined) {
        $('#status-bar').html('Syncing');
    } else {
        $('#status-bar').html('Syncing: ' + userJoined);
    }
    $('#status-bar').show();
    console.log(username, userToPause, userJoined);
    if (username == userToPause && userJoined != username) {
        // console.log(player);
        // player.pauseVideo();
        if (getState() == 1) {
            // console.log('sync while play');
            pauseVideoTrigger();
            setTimeout(playVideoTrigger, 500);
        } else {
            console.log('sending pause for sync');
            socket.emit('pause', player.getCurrentTime(), username);
        }
    }
    setTimeout(function() {
        $('#status-bar').hide();
    }, 2000)
});
socket.on('hostStart', function(time, videoTime) {

    // console.log('should start');

    // var play = $('#player');
    // console.log(player);
    // console.log('response ' + time);
    // player.playVideo();
    // console.log(new Date().getTime(), "time of reach")
    // console.log(time, 'to play at');
    // console.log(time, new Date().getTime(), timeToAdd, 'delay');
    // if (user != username) {


    // 	// player.pauseVideo();
    // }
    player.seekTo(videoTime - 1, true);
    player.seekTo(videoTime, true);
    // console.log(timeToAdd);
    // console.log('timeout', time - (new Date().getTime() + timeToAdd));
    setTimeout(playVideo, time - (new Date().getTime() + timeToAdd));

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
