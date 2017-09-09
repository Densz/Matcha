const plusButton = document.querySelector('.upload-photo'),
    transparentBackground = document.querySelector('.popup-upload-photo'),
    popupUpload  = document.querySelector('.popup-box'),
    closePopup = document.querySelector('.close-pop-up'),
    chosenPicture = document.querySelectorAll('.upload-img'),
    eraseBtnPicture = document.querySelectorAll('.erase-picture');

var profilePicture = document.querySelector('.profile_picture');

function url(){
    var url =  window.location.href;
    url = url.split("/");
    return(url[0] + '//' + url[2] + '');
}

document.querySelector('#profileButton').setAttribute('class', 'active');

if (chosenPicture.length === 1) {
    eraseBtnPicture[0].remove();
}

if (eraseBtnPicture) {
    for (var i = 0; i < eraseBtnPicture.length; i++) {
        eraseBtnPicture[i].addEventListener('click', function() {
            if (chosenPicture.length === 1) {
                eraseBtnPicture[0].remove();
            }
            var xhr = new XMLHttpRequest(),
                tmp = this.previousElementSibling.src.split("/");

            xhr.open('POST', url() + '/myprofile/erasePicture', true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send('pictureToErase=' + tmp[4]);
            xhr.onload = function() {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        var string = xhr.responseText;

                        if (string !== 'null') {
                            var profilePicture = document.querySelector('.profile_picture');
                            profilePicture.src = '/uploads/' + string;
                            document.querySelector('.upload-img').id = 'selected-img';
                        }
                    }
                }
            };
            this.parentNode.parentNode.removeChild(this.parentNode);
            if (document.querySelectorAll('.upload-img').length === 1) {
                document.querySelector('.erase-picture').remove();
            }
        })
    }
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
        var tmp = this.src.split("/");
        profilePicture.src = '/uploads/' + tmp[4];
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
