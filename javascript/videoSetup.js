
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
var params = getJsonFromUrl();
// console.log(res);

function startVideo(video_url) {
	var info = video_url.match(/\=(.*?)$/);
	console.log(info);
	if (info.length > 1)
	{
		console.log(info[1]);
		//How do I show that player is already defined
		player.loadVideoById(info[1], 5, "large");
	}
}


// 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  var ignore = false;
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: params.vId,
      controls: 0,
      autoPlay: 1,
      playerVars: { 'rel': 0, 'modestbranding': 1, 'frameborder': 0, 'fs': 0 },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
  //these variables are used for preventing calback events attached to
  //state change events from feeding back into eachother
  //ex. on play event, a callback pauses the video
  //

  //initialize is used to prevent callbacks from triggering
  //during calls made during on player ready
  // var initialize = false;
  // 4. The API will call this function when the video player is ready.
  var currentState = 0;
  function getState() {
    return currentState;
  }
  // var played = false;
  function onPlayerReady(event) {

    // playVideo(pauseVideo,);
    // pauseVideo();
    player.seekTo(0);
    //to stop it from firing if the video is replayed
    // if (!played) {
    // console.log('player ready');

    //   played = true;
    // }
    // ignore = false;
    // initialize = true;
    // setTimeout(pauseVideo, 1000);
    // socket.emit('connect', new Date.getTime());
    // pauseVideo();
    // if (player.getVideoLoadedFraction() > .4) {
    //   socket.emit('ready');
    //   return;
    // }
  }

  // $(window).click(function() {
  //   console.log('ADFADSFADSF');
  //   if (currentState = 2) {

  //     console.log('sending pause');
  //     socket.emit('pause', player.getCurrentTime(), username);
  //   }
  // })
  // var listener = addEventListener('blur', function() {
  //     if(document.activeElement === document.getElementById('player')) {
  //         // clicked
  //         console.log('hello');
  //     }
  //     $(window).focus();
  // });
  // //
  // jQuery(document).ready(function($){
  //   $('#video-box').iframeTracker({
  //       blurCallback: function(){
  //           // Do something when the iframe is clicked (like firing an XHR request)
  //           // alert('clicked');
  //           console.log('hello');
  //           setTimeout(function() {
  //             $('#messenger-box').trigger('click');
  //           },1000);
  //         }
  //     });
  // });

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  var initialize = true;
  function onPlayerStateChange(event) {
    console.log(ignore, event.data);
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
    currentState = event.data;
    if (event.data == 3) {
      //interrupts the ignore otherwise
      if (player.getCurrentTime() > 3) {
        //assume that slow connection and player is buffering
        //pause others
        // ignore = true;
        // player.pauseVideo();
        // var time = player.getCurrentTime();
        // //youtube doesnt restart second if you call seek to on the second its at (i think)
        // player.seekTo(time - 1, true);
        // player.seekTo(time, true);
        // socket.emit('play', username, time);
      }
      return;
    }
    // console.log(ignore, event);
    if (ignore) {
      ignore = false;
      return;
    }
    if (event.data == 1) { //video is now playing
      if (initialize) {
        initialize = false;
        pauseVideo();
        player.seekTo(0);
        ignore = false;
        startSync();
        return;
      }
      ignore = true;
      player.pauseVideo();
      var time = player.getCurrentTime();
      //youtube doesnt restart second if you call seek to on the second its at (i think)
      player.seekTo(time - 1, true);
      player.seekTo(time, true);
      socket.emit('play', username, time);
      console.log('sent play');
    } else if (event.data == 2) { //video is now paused
      console.log('sending pause');
      socket.emit('pause', player.getCurrentTime(), username);
    } else if (event.data == 0) {
      console.log('end');
      //for when user clicks play again
      ignore = false;
      // initialize = true;
    }
  }

  function playVideoTrigger() {
    if (getState != 1) {
      player.playVideo();
    }
  }
  function pauseVideoTrigger() {
    if (getState != 2) {
      player.pauseVideo();
    }
  }

  function playVideo(callback, delay) {
    console.log('state', getState());
    if (getState() != 1) {
      ignore = true;
      player.playVideo();
    }
    if (callback != null) {
      if (delay != null) {
        setTimeout(callback, delay);
      } else {
        callback();
      }
    }
  }
  function pauseVideo(callback, delay) {
    console.log('state', getState());
    if (getState() != 2) {
      ignore = true;
      player.pauseVideo();
    }
    if (callback != null) {
      if (delay != null) {
        setTimeout(callback, delay);
      } else {
        callback();
      }
    }
  }
  function stopVideo() {
    player.stopVideo();
  }
