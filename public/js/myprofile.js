const plusButton = document.querySelector('.upload-photo'),
    transparentBackground = document.querySelector('.popup-upload-photo'),
    popupUpload  = document.querySelector('.popup-box'),
    closePopup = document.querySelector('.close-pop-up'),
    chosenPicture = document.querySelectorAll('.upload-img');

function url(){
    var url =  window.location.href;
    url = url.split("/");
    return(url[0] + '//' + url[2] + '');
}

for (var i = 0; i < chosenPicture.length; i++) {
    chosenPicture[i].addEventListener('click', function(){
        for(var j= 0; j < chosenPicture.length; j++) {
            chosenPicture[j].removeAttribute('id');
        }
        var xhr = new XMLHttpRequest();

        xhr.open('POST', url() + '/myprofile/changingpic', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('frontPic=' + this.src);
        this.id = 'selected-img';
    })
}

plusButton.addEventListener('click', () => {
    transparentBackground.style.display = 'inherit';
    popupUpload.style.display = 'inherit';
});

closePopup.addEventListener('click', () => {
    transparentBackground.style.display = 'none';
    popupUpload.style.display = 'none';
});

const editName = document.querySelector('#edit-name'),
    editBio = document.querySelector('#edit-bio'),
    formName = document.querySelector('#form-name'),
    formBio = document.querySelector('#form-bio');

editName.addEventListener('click', () => {
    if (formName.style.display === 'none' || formName.style.display === '')
        formName.style.display = 'inherit';
    else
        formName.style.display = 'none';
});

editBio.addEventListener('click', () => {
    if (formBio.style.display === 'none' || formBio.style.display === '')
        formBio.style.display = 'inherit';
    else
        formBio.style.display = 'none';
});
