var searchbar = document.querySelector('#searchbar');
var resultBox = document.querySelector('.result-search');

function url(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[0] + '//' + url[2] + '');
}

searchbar.addEventListener('input', function(){
    if (searchbar.value)
        resultBox.style.display = 'inline';
    else 
        resultBox.style.display = 'none';
    resultBox.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url() + '/home/searchRequest', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('value=' + searchbar.value);
    xhr.onload = function() {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200 || xhr.status === 0) {
                var responseText = xhr.responseText;
                if (responseText !== "No data") {
                    var i = 0;
                    var result = JSON.parse(responseText);
                    while (result[i]) {
                        var a = document.createElement('a');
                        var linebreak = document.createElement('br');
                        a.href = '/profile/' + result[i]['login'];
                        a.innerHTML = result[i]['firstName'] + " " + result[i]['lastName'];
                        resultBox.appendChild(a);
                        resultBox.appendChild(linebreak);
                        i++;
                    }
                } else {
                    var span = document.createElement('span');
                    span.innerHTML = "No result found";
                    resultBox.appendChild(span);
                }
            }
        }
    }
});