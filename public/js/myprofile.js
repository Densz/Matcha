const plusButton = document.querySelector('.upload-photo'),
    transparentBackground = document.querySelector('.popup-upload-photo'),
    popupUpload  = document.querySelector('.popup-box'),
    closePopup = document.querySelector('.close-pop-up');

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

$('.upload-btn').on('click', () => {
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function() {
    let files = $(this).get(0).files;
    if (files.length === 1) {
        console.log('A file had been selected');
        let formData = new FormData();
        formData.append('upload', files[0], files[0].name);
        console.log('Data added to the formData');

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('upload successful!');
            },
            xhr: function () {
                let xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', (evt) => {
                    if (evt.lengthComputable) {
                        let percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }
                    }
                }, false);

                return xhr;
            }
        });
    }
});