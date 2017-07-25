var likeProfile = document.querySelector('.like');
var dislikeProfile = document.querySelector('.dislike');

function urlUserProfile(){
    var url =  window.location.href;
    url = url.split("/");
    return(url[4]);
}

if (likeProfile) {
    likeProfile.addEventListener("click", function(){
        socket.emit('new like', { to: urlUserProfile() });
    })
}

if (dislikeProfile) {
    dislikeProfile.addEventListener("click", function(){
        socket.emit('new view', { to: urlUserProfile() });
    })
}