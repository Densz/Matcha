// Delete Hashtag of user
var hashtags = document.querySelectorAll('.hashtag_user'),
    i = 0;

document.querySelector('#homeButton').setAttribute('class', 'active');

if (hashtags) {
    for (i = 0; i < hashtags.length; i++) {
        hashtags[i].addEventListener('mouseover', function(){
            this.style.textDecoration = "line-through";
        });

        hashtags[i].addEventListener('mouseout', function(){
            this.style.textDecoration = "none";
        });

        hashtags[i].addEventListener('click', function(){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url() + '/home/deleteHashtag', true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send('hashtagToDelete=' + this.innerHTML.substring(1));
            this.remove();
        });
    }
}