//Make the connection with Socket (io.on('connection' ....) /app.js)
var socket = io.connect('http://localhost:3000', { 'force new connection': true });

var message = document.querySelector('#message'),
    send = document.querySelector('#send'),
    output = document.querySelector('#output'),
    selectChat = document.querySelectorAll('.chat-people')

/**
 * Handle connections Online / Offline users
 */
socket.on('new user connection', function(data){
    console.log('New user connected: ', data);
    if (document.getElementById('select-' + data)) {
        document.getElementById('select-' + data).childNodes[1].childNodes[1].className = 'profile_picture_chat online';
    }
})

socket.on('user disconnected', function(data){
    console.log('User disconnected: ', data);
    if (document.getElementById('select-' + data)) {
        document.getElementById('select-' + data).childNodes[1].childNodes[1].className = 'profile_picture_chat offline';
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

/**
 * Get the right conversation with the right user
 */
var i = 0;

for (i; i < selectChat.length; i++) {
    if (document.addEventListener) {
		selectChat[i].addEventListener("click", selectConversation);
	} else {
        selectChat[i].attachEvent("click", selectConversation);
	}
}

function selectConversation(){
    console.log(this.id.split('-')[1]);
}