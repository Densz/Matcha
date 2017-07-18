//Make the connection with Socket (io.on('connection' ....) /app.js)
var socket = io.connect('http://localhost:3000');

var message = document.querySelector('#message'),
    send = document.querySelector('#send'),
    output = document.querySelector('#output')

send.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value
    })
});

socket.on('chat', function(data){
    output.firstElementChild.nextElementSibling.innerHTML += '<p>' + data.message + '<p>';
});