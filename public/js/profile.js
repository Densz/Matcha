var likeProfile = document.querySelector('.like');
var dislikeProfile = document.querySelector('.dislike');
var div = document.querySelector('#swipe');

function urlUserProfile(){
    var url =  window.location.href;
    url = url.split("/");
    return(url[4]);
}

if (likeProfile) {
    likeProfile.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var loginSwiped = urlUserProfile();
        
        socket.emit('new like', { to: loginSwiped });
        xhr.open('POST', url() + '/home/swipe', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('loginSwiped=' + loginSwiped + '&status=like');
        xhr.onload = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var response = JSON.parse(xhr.responseText);
                    if (response['match'] === true) {
                        socket.emit('new match', { to: loginSwiped });
                    }
                }
            }
        }
        likeProfile.remove();
        dislikeProfile.remove();
        var span = document.createElement('span');
        var b = document.createElement('b');

        b.innerHTML = "You liked this profile already";
        span.appendChild(b);
        div.appendChild(span);
    })
}

if (dislikeProfile) {
    dislikeProfile.addEventListener('click', function(){
        var xhr = new XMLHttpRequest();
        var loginSwiped = urlUserProfile();

        socket.emit('new view', { to: loginSwiped });    
        xhr.open('POST', url() + '/home/swipe', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('loginSwiped=' + loginSwiped + '&status=dislike');
            
        likeProfile.remove();
        dislikeProfile.remove();
        var span = document.createElement('span');
        var b = document.createElement('b');        
        b.innerHTML = "You disliked this profile already";
        span.appendChild(b);
        div.appendChild(span);
    })
}