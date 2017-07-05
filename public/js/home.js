/**
 * 
 * Duplicated Functions (settings.js)
 * 
 */
function url(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[0] + '//' + url[2] + '');
}

function success(pos) {
  var crd = pos.coords;
  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + crd.latitude + ',' + crd.longitude, true);
  xhr.send();
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 || xhr.status === 0) {
        var string = xhr.responseText;
        var address = JSON.parse(string);

        var tmpAddress = address['results'][0]['formatted_address'];
        /** 
         * For the moment only on the settings page, but need to locate the guy also in Homepage
         */
        var htmlLocation = document.querySelector('#location');
        if (htmlLocation.placeholder === 'Current location') {
            htmlLocation.placeholder = address['results'][0]['formatted_address'] + ' - detected';
        }
        /**
         * -- END --
         */
        insertTmpAddress(tmpAddress, crd.latitude, crd.longitude);
      }
    }
  };
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  htmlAddress.innerHTML = 'Address not found';
  return null;
};

function insertTmpAddress(address, lat, lng) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url() + '/settings/getAddress', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send('tmpAddress=' + address + '&tmpLat=' + lat + '&tmpLng=' + lng);
};

navigator.geolocation.getCurrentPosition(success, error);