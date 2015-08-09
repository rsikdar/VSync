function divScroll() {
    // window.scrollBy(0,35);
    var div = $('#message-box');
    div[0].scrollTop = div[0].scrollHeight;
}

// var user = prompt("please enter name:");
// var username = user;
// var socket = io();
// socket.emit('connected', [user, '>>> ' + user + ' has connected']);
user = username + ": ";

window.onblur = blur_true;
window.onfocus = disable_notif;

function blur_true() {
    blur = true;
}

function disable_notif() {
    blur = false;
    $(document).attr("title", 'chat');
}

function PlaySound(soundObj) {
  var sound = document.getElementById(soundObj);
  sound.play();
}


var searchTimeout;

//user is typing and text entered function trigger
// $('#messenger-box').keypress(function () {
//     socket.emit('typing', username);
//     socket.emit('text_entered_remove', username);

//     if (searchTimeout !== undefined) clearTimeout(searchTimeout);
//     searchTimeout = setTimeout(function(){
//         var form_text = document.forms["Form"]["m"].value;
//         if (!(form_text === null || form_text === "")){
//             socket.emit('text_entered', username);
//             socket.emit('typing_remove', username);
//         }

//     }, 2000);

// });
//checking if text is empty (user deletes text after typing) and resets
// setInterval(function(){
//             var form_text = document.forms["Form"]["m"].value;
//             if (form_text === null || form_text === ""){
//                 // console.log('no text entered', form_text);
//                 socket.emit('typing_remove', username);
//                 socket.emit('text_entered_remove', username);
//         }
//         }, 1000);

function notification(){
    if (blur) {//user is in a different tab
        // PlaySound('sound1');
        $(document).attr("title", '(1) VSync');
    }
}

function generate_friends(all_users){
    //removes user from list of all users so their own name doesn't appear on friends list
    var index = all_users.indexOf(username);
    all_users.splice(index, 1);

    // if (all_users.length > 0) {
    //     var list = '';
    //     all_users.forEach(function (element) {
    //         list = list + '<button type="button" class="btn btn-default">' + element + '</button>';
    //     });
    //     txt ='<div class="btn-group-vertical" role="group" aria-label="...">' + list + '</div>';
    // } else {
    // //no one is in chat so friends list is reset to original message
    //     txt = '<li> You should make some friends </li>';
    // }
    // document.getElementById('online_friends').innerHTML = txt;
}

function generate_typing_status(element, list, text, text1){
    //removing user from users typing, so that they dont see the message for themselves
    var index_tmp = list.indexOf(username);
    if (index_tmp >= 0) {
        list.splice(index_tmp, 1);
    }
    var txt = '';
    if (list.length === 1) {
        txt = list[0] + text;
    } else if (list.length > 1) {
        for (var i = 0; i < list.length - 1; i++) {
            txt = txt + list[i] + ', ';
        }
        if (list.length === 2) {
            txt = txt.substring(0, txt.length - 2);
            txt = txt + ' and ' + list[list.length - 1] + text1;
        } else {
        txt = txt + ' and ' + list[list.length - 1] + text1;
        }

    }
    document.getElementById(element).innerHTML  = txt;
}


//emits the chat message typed to all the other sockets and clears the text box
// $('form').submit(function(){
//     socket.emit('chat message', user + $('#messenger-box').val());
//     // socket.emit('typing_remove', username); //remove person from typing list
//     $('#messenger-box').val(''); //clear text box
//     return false;
// });
$(document).ready(function(){
    $('#message').bind('keypress', function(e) {
        // console.log(e.keyCode);
        if(e.keyCode==13){
            sendChatMessage();

        }
    });
    $('#send-button').click(function(evt){
        // evt.preventDefault()
        sendChatMessage();
    });
});
function sendChatMessage() {
    var msg = $('#message').val();
    // console.log('enter chat message');
    // console.log(msg);
    if (msg == "" || !msg.replace(/\s/g, '').length) {
        //string was empty or just white space
        return false;
    }
    // console.log('sending chat message');
    socket.emit('chat message', user + msg, username);
    // socket.emit('typing_remove', username); //remove person from typing list
    $('#message').val(''); //clear text box
    return false;
}

//when a user stops typing but has text entered
// socket.on('text_entered', function(users_text_enter, users_typing){
//     generate_typing_status('typing', users_typing, ' is typing', ' are typing');
//     generate_typing_status('text_entered', users_text_enter, ' has entered text', ' have entered text');
// });

//when a user is typing
// socket.on('typing', function(users_typing){
//     generate_typing_status('typing', users_typing, ' is typing', ' are typing');
// });

//on recieving a chat message event, appends message
userToColor = new Array();
function getUserColor(username) {
    var userColor = userToColor[username];
    if (userColor === undefined) {
        //assign a color
        var userColor = randomColor({luminosity: 'light',count: 1})[0];
        userToColor[username] = userColor;
    }
    return userColor;
}
socket.on('chat message', function(msg, username){

    var userColor = getUserColor(username);
    $('#messages').append($('<li>').text(msg));
    // console.log(userColor);
    // console.log($('#message-box').nth-last-child(1));
    $('#messages li:nth-last-child(1)').css('background-color',userColor);
    divScroll();
    notification();
});

//for displaying message when a user joins or leaves the room
socket.on('connect and disconnect', function(msg, userJoin, all_users){
    var userColor = getUserColor(userJoin);
    $('#messages').append($('<li>').text(msg));
    $('#messages li:nth-last-child(1)').css('background-color',userColor);
    divScroll();
    // generate_friends(all_users);
    notification();
});
