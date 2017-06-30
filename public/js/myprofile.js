const plusButton = document.querySelector('.upload-photo'),
    transparentBackground = document.querySelector('.popup-upload-photo'),
    popupUpload  = document.querySelector('.popup-box'),
    closePopup = document.querySelector('.close-pop-up');

plusButton.addEventListener('click', function(){
    transparentBackground.style.display = 'inherit';
    popupUpload.style.display = 'inherit';
});

closePopup.addEventListener('click', function(){
    transparentBackground.style.display = 'none';
    popupUpload.style.display = 'none';
});

const editName = document.querySelector('#edit-name'),
    editBio = document.querySelector('#edit-bio'),
    formName = document.querySelector('#form-name'),
    formBio = document.querySelector('#form-bio');

editName.addEventListener('click', function(){
    if (formName.style.display === 'none' || formName.style.display === '')
        formName.style.display = 'inherit';
    else
        formName.style.display = 'none';
});

editBio.addEventListener('click', function(){
    if (formBio.style.display === 'none' || formBio.style.display === '')
        formBio.style.display = 'inherit';
    else
        formBio.style.display = 'none';
});