var plusButton = document.querySelector('.upload-photo');
var transparentBackground = document.querySelector('.popup-upload-photo');
var popupUpload  = document.querySelector('.popup-box');
var closePopup = document.querySelector('.close-pop-up');

console.log(plusButton);

plusButton.addEventListener('click', function(){
    transparentBackground.style.display = 'inherit';
    popupUpload.style.display = 'inherit';
});

closePopup.addEventListener('click', function(){
    transparentBackground.style.display = 'none';
    popupUpload.style.display = 'none';
});