var htmlAddress = document.querySelector('#cur-address');

function success(pos) {
  var crd = pos.coords;
  console.log(crd);
  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + crd.latitude + ',' + crd.longitude, true);
  xhr.send();
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 || xhr.status === 0) {
        var string = xhr.responseText;
        var address = JSON.parse(string);

        htmlAddress.innerHTML = address['results'][0]['formatted_address'] + ' - (detected)';
      }
    }
  }
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  htmlAddress.innerHTML = 'Address not found';
  return null;
};

navigator.geolocation.getCurrentPosition(success, error);