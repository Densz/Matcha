var likeButton = document.querySelector('.like');
var dislikeButton = document.querySelector('.dislike');
var people = document.querySelector('#peopleList');
var like = document.querySelector('.dislike');
var dislike = document.querySelector('.like');
var arrowNext = document.querySelector('.next-arrow');
var arrowPrev = document.querySelector('.previous-arrow');


function url(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[0] + '//' + url[2] + '');
}
if (arrowNext != null) {
    arrowNext.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var currSrcPic = document.querySelector('.match-img');
        var loginMatch = currSrcPic.parentNode.childNodes[1].innerHTML;
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
        var currSrcPic = document.querySelector('.match-img');
        var loginMatch = currSrcPic.parentNode.childNodes[1].innerHTML;
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
if (likeButton) {
    likeButton.addEventListener('click', function(){
        var xhr = new XMLHttpRequest();
        var loginSwiped = people.firstElementChild.querySelector('#matchedLogin').innerHTML;

        socket.emit('new like', { to: loginSwiped });
        xhr.open('POST', url() + '/home/swipe', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('loginSwiped=' + loginSwiped + '&status=like');
        xhr.onload = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var response = JSON.parse(xhr.responseText);
                    (response);
                    if (response['match'] === true) {
                        socket.emit('new match', { to: loginSwiped });
                    }
                }
            }
        }

        people.removeChild(people.firstElementChild);
        people.firstElementChild.style.display = 'inherit';
        if (people.firstElementChild.id === 'no-more') {
            like.remove();
            dislike.remove();
            arrowNext.remove();
            arrowPrev.remove();
        }
    });
}
if (dislikeButton) {
    dislikeButton.addEventListener('click', function(){
        var xhr = new XMLHttpRequest();
        var loginSwiped = people.firstElementChild.querySelector('#matchedLogin').innerHTML;

        socket.emit('new view', { to: loginSwiped });
        xhr.open('POST', url() + '/home/swipe', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('loginSwiped=' + loginSwiped + '&status=dislike');

        people.removeChild(people.firstElementChild);
        people.firstElementChild.style.display = 'inherit';
        if (people.firstElementChild.id === 'no-more') {
            like.remove();
            dislike.remove();
            arrowNext.remove();
            arrowPrev.remove();
        }
    });
}
