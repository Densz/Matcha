var likeButton = document.querySelector('.like');
var dislikeButton = document.querySelector('.dislike');
var people = document.querySelector('#peopleList');
var like = document.querySelector('.dislike');
var dislike = document.querySelector('.like');

likeButton.addEventListener('click', function(){
    people.removeChild(people.firstElementChild);
    people.firstElementChild.style.display = 'inherit';
    if (people.firstElementChild.id === 'no-more') {
        like.remove();
        dislike.remove();
    }
})

dislikeButton.addEventListener('click', function(){
    people.removeChild(people.firstElementChild);
    people.firstElementChild.style.display = 'inherit';
    if (people.firstElementChild.id === 'no-more') {
        like.remove();
        dislike.remove();
    }
})