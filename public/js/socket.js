//Make the connection with Socket (io.on('connection' ....) /app.js)
var socket = io.connect('http://localhost:3000', { 'force new connection': true });

function urlPage(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[3]);
}

var connectedUser = document.getElementById('userLogin').innerHTML;

if (urlPage() === 'home') {
    var message = document.querySelector('#message'),
        send = document.querySelectorAll('.send'),
        output = document.querySelector('#output'),
        selectChat = document.querySelectorAll('.chat-people');
    var messageBox = document.querySelectorAll('.message-box');    

    /**
     * Handle connections Online / Offline users
     */
    socket.on('new user connection', function(data){
        if (document.getElementById('select-' + data)) {
            document.getElementById('select-' + data).childNodes[1].childNodes[1].className = 'profile_picture_chat online';
        }
    })

    socket.on('user disconnected', function(data){
        if (document.getElementById('select-' + data)) {
            document.getElementById('select-' + data).childNodes[1].childNodes[1].className = 'profile_picture_chat offline';
        }
    })

    /**
     * Add event listener to button SEND
     */
    var i = 0;
    for (i; i < send.length; i++) {
        send[i].addEventListener('click', function(){
            if (this.parentElement.previousElementSibling.value !== "") {
                socket.emit('send message to back', {
                    from: connectedUser,
                    to: this.id,
                    message: this.parentElement.previousElementSibling.value
                })
                socket.emit('new message', {
                    to: this.id
                })
                this.parentElement.previousElementSibling.value = "";
            }
        })
    }

    /**
     * send message to server
     */
    socket.on('send message response back', function(data){
        var sentMessage = document.createElement('div');
        sentMessage.className = 'row msg-img-text';
            var emptyDiv = document.createElement('div');
            emptyDiv.className = "col-sm-1 col-xs-1 col-md-1";
            var messageBox = document.createElement('div');
            messageBox.className = "col-sm-8 col-xs-8 col-md-8 message-sent alignRight";
                var p = document.createElement('p');
                p.innerHTML = data['message'];
            var imgBox = document.createElement('div');
            imgBox.className = 'col-sm-2 col-xs-2 col-md-2';
                var img = document.createElement('img');
                img.src = '/uploads/' + data['from']['profilePicture'];
                img.className = "profile_picture_chat";
        messageBox.appendChild(p);
        imgBox.appendChild(img);
        sentMessage.appendChild(emptyDiv);
        sentMessage.appendChild(messageBox);
        sentMessage.appendChild(imgBox);
        if (document.getElementById('chat-' + data['to']['login'])) {
            document.getElementById('chat-' + data['to']['login']).childNodes[1].appendChild(sentMessage);
        }
        socket.emit('Alert people new message', data);
    });


    /**
     * Receive message from server
     */
    socket.on('Alert people new message', function(data){
        if (data['to']['login'] === connectedUser) {
            var receivedMessage = document.createElement('div');
            receivedMessage.className = 'row msg-img-text';
                var imgBox = document.createElement('div');
                imgBox.className = 'col-sm-2 col-xs-2 col-md-2 alignRight';
                    var img = document.createElement('img');
                    img.src = '/uploads/' + data['from']['profilePicture'];
                    img.className = "profile_picture_chat";
                var messageBox = document.createElement('div');
                messageBox.className = "col-sm-9 col-xs-9 col-md-9 message-received";
                    var p = document.createElement('p');
                    p.innerHTML = data['message'];
            imgBox.appendChild(img);
            messageBox.appendChild(p);
            receivedMessage.appendChild(imgBox);
            receivedMessage.appendChild(messageBox);
            document.getElementById('chat-' + data['from']['login']).childNodes[1].appendChild(receivedMessage);
        }
    });

    /**
     * Get the right conversation with the right user
     */
    var i = 0;
    for (i; i < selectChat.length; i++) {
        selectChat[i].addEventListener("click", selectConversation);
    }

    function selectConversation(){
        var chatbox = document.querySelectorAll('.chatbox');
        var i = 0;
        for (i; i < chatbox.length; i++) {
            chatbox[i].style.display = "none";
        }
        document.getElementById('chat-'+this.id.split('-')[1]).style.display = 'inline';
    }

    /**
     * Scroll to Bottom
    */

    // function scrollToBottom() {
    //     var i = 0;
    //     for (i; messageBox.length; i++){
    //         if (messageBox[i].scrollHeight !== undefined) {
    //             messageBox[i].scrollTop = messageBox[i].scrollHeight;
    //         }
    //     }
    // }
    // scrollToBottom();
}