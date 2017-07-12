var likeButton = document.querySelector('.like');
var dislikeButton = document.querySelector('.dislike');
var people = document.querySelector('#peopleList');
var like = document.querySelector('.dislike');
var dislike = document.querySelector('.like');

function url(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[0] + '//' + url[2] + '');
}

likeButton.addEventListener('click', function(){
    var xhr = new XMLHttpRequest();
    var loginSwiped = people.firstElementChild.querySelector('#matchedLogin').innerHTML;
    
    xhr.open('POST', url() + '/home/swipe', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('loginSwiped=' + loginSwiped + '&status=like');

    people.removeChild(people.firstElementChild);
    people.firstElementChild.style.display = 'inherit';
    if (people.firstElementChild.id === 'no-more') {
        like.remove();
        dislike.remove();
    }
})

dislikeButton.addEventListener('click', function(){
    var xhr = new XMLHttpRequest();
    var loginSwiped = people.firstElementChild.querySelector('#matchedLogin').innerHTML;
    
    xhr.open('POST', url() + '/home/swipe', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('loginSwiped=' + loginSwiped + '&status=dislike');

    people.removeChild(people.firstElementChild);
    people.firstElementChild.style.display = 'inherit';
    if (people.firstElementChild.id === 'no-more') {
        like.remove();
        dislike.remove();
    }
})