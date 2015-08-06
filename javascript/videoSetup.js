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
      videoId: 'Awf45u6zrP0',
      controls: 0,
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

  //initialize is used to prevent callbacks from triggering
  //during calls made during on player ready
  // var initialize = false;
  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    playVideo(pauseVideo);
    // pauseVideo();
    // if (player.getVideoLoadedFraction() > .4) {
    //   socket.emit('ready');
    //   return;
    // }
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
    if (event.data == 3) {
      //interrupts the ignore otherwise
      return;
    }
    console.log(ignore, event);
    if (ignore) {
      ignore = false;
      return;
    }
    if (event.data == 1) { //video is now playing
      ignore = true;
      player.pauseVideo();
      socket.emit('play', username, player.getCurrentTime());
    } else if (event.data == 2) { //video is now paused
      console.log('sending pause');
      socket.emit('pause', player.getCurrentTime(), username);
    }
  }
  function playVideo(callback) {
    ignore = true;
    player.playVideo();
    if (callback != null) {
      callback();
    }
  }
  function pauseVideo(callback) {
    ignore = true;
    player.pauseVideo();
    if (callback != null) {
      callback();
    }
  }
  function stopVideo() {
    player.stopVideo();
  }
