var buttonNotifications = document.querySelector('#notificationsButton'),
    notificationsBox = document.querySelector('.notifications');

function url(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[0] + '//' + url[2] + '');
}

buttonNotifications.addEventListener("click", function(){
    if (notificationsBox.style.display === "none") {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url() + '/home/setSeenNotifications', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
        notificationsBox.style.display = "inherit";
        buttonNotifications.innerHTML = 'Notifications'
    } else {
        notificationsBox.style.display = "none"; 
    }
});

function showNotification(login, text) {
    var p = document.createElement('p');
    var b = document.createElement('b');
    var a = document.createElement('a');
    var span = document.createElement('span');
    span.innerHTML = text;
    a.href = '/profile/' + login;
    a.innerHTML = login;
    b.appendChild(a);
    b.appendChild(span);
    p.appendChild(b);
    notificationsBox.appendChild(p);
    buttonNotifications.innerHTML = '<b>Notifications</b>'
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