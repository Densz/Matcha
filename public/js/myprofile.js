const plusButton = document.querySelector('.upload-photo'),
    transparentBackground = document.querySelector('.popup-upload-photo'),
    popupUpload  = document.querySelector('.popup-box'),
    nameEditButton = document.querySelectorAll('.btn-link'),
    closePopup = document.querySelector('.close-pop-up');

plusButton.addEventListener('click', function(){
    transparentBackground.style.display = 'inherit';
    popupUpload.style.display = 'inherit';
});

closePopup.addEventListener('click', function(){
    transparentBackground.style.display = 'none';
    popupUpload.style.display = 'none';
});

nameEditButton[0].addEventListener('click', function() {
    let nameEditForm = document.querySelectorAll('.editable_info');
    nameEditForm[0].className += 'show_class';
});

