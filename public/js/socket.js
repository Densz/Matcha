//Make the connection with Socket (io.on('connection' ....) /app.js)
var socket = io.connect('http://localhost:3000', { 'force new connection': true });

var message = document.querySelector('#message'),
    send = document.querySelector('#send'),
    output = document.querySelector('#output')

/**
 * Handle connections Online / Offline users
 */
socket.on('new user connection', function(data){
    console.log('New user connected: ', data);
    if (document.getElementById('chat-' + data)) {
        document.getElementById('chat-' + data).childNodes[3].childNodes[1].className = 'profile_picture_chat online';
    }
})

socket.on('user disconnected', function(data){
    console.log('User disconnected: ', data);
    if (document.getElementById('chat-' + data)) {
        document.getElementById('chat-' + data).childNodes[3].childNodes[1].className = 'profile_picture_chat offline';
    }
})

/**
 * Send message to server
 */
send.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value
    })
});

socket.on('chat', function(data){
    output.firstElementChild.nextElementSibling.innerHTML += '<p>' + data.message + '<p>';
});


/**
 * Receive message from server
 */
socket.on('message received', function(data){

});