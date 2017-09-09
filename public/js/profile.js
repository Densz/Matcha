var likeProfile = document.querySelector('.like');
var dislikeProfile = document.querySelector('.dislike');
var dislikeAfterLike = document.querySelector('#dislikeAfterLike');
var div = document.querySelector('#swipe');
var arrowNext = document.querySelector('#next-arrow');
var arrowPrev = document.querySelector('#previous-arrow');

if (arrowNext != null) {
    arrowNext.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var currSrcPic = document.querySelector('.profile_picture');
        var loginMatch = urlUserProfile();
        var currPicName = currSrcPic.src.split("/");
        xhr.open('POST', url() + '/home/nextPicture', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('indexCurrPic=' + currPicName[4] + '&loginMatch=' + loginMatch);
        xhr.onload = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var res = xhr.responseText;
                    currSrcPic.src = res;
                }
            }
        }
    });
}
if (arrowPrev !== null) {
    arrowPrev.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var currSrcPic = document.querySelector('.profile_picture');
        var loginMatch = urlUserProfile();
        var currPicName = currSrcPic.src.split("/");
        xhr.open('POST', url() + '/home/previousPicture', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('indexCurrPic=' + currPicName[4] + '&loginMatch=' + loginMatch);
        xhr.onload = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var res = xhr.responseText;
                    currSrcPic.src = res;
                }
            }
        }
    });
}
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
        window.location.href = url() + '/profile/' + urlUserProfile();
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
        window.location.href = url() + '/profile/' + urlUserProfile();
    })
}

if (dislikeAfterLike) {
    dislikeAfterLike.addEventListener('click', function(){
        var loginSwiped = urlUserProfile();
        socket.emit('new dislike', { to: loginSwiped });
    })
}