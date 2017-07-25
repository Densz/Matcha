var buttonNotifications = document.querySelector('#notificationsButton'),
    notificationsBox = document.querySelector('.notifications');

buttonNotifications.addEventListener("click", function(){
    if (notificationsBox.style.display === "none") {
        notificationsBox.style.display = "inherit";
    } else {
        notificationsBox.style.display = "none"; 
    }
});

function showNotification(login, text) {
    var p = document.createElement('p');
    var a = document.createElement('a');
    var span = document.createElement('span');
    span.innerHTML = text;
    a.href = '/profile/' + login;
    a.innerHTML = login;
    p.appendChild(a);
    p.appendChild(span);
    notificationsBox.appendChild(p);
}

socket.on('Show like to user', function(data){
    if (data['to'] === connectedUser) {
        showNotification(data['from'], " just liked your profile");
    }
})
socket.on('Show view to user', function(data){
    if (data['to'] === connectedUser) {
        showNotification(data['from'], " just viewed your profile");
    }
})
socket.on('Show message to user', function(data){
    if (data['to'] === connectedUser) {
        showNotification(data['from'], " sent you a message");
    }
})
socket.on('Show match to user', function(data){
    if (data['to'] === connectedUser) {
        showNotification(data['from'], " just matched your profile");
    }
})
socket.on('Show dislike to user', function(data){
    if (data['to'] === connectedUser) {
        showNotification(data['from'], " just disliked your profile");
    }
})