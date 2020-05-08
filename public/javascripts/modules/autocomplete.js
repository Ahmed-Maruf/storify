function autocomplete(input, lat, lng) {
	if(!input) return;
	const dropDown = new google.maps.places.Autocomplete(input);
	dropDown.addListener('place_changed', () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			lat.value = geolocation.lat;
			lng.value = geolocation.lng;
		});
	});
	
	input.on('keydown', e => {
		if (e.keyCode == 13){
			e.preventDefault();
		}
	});
}

export default autocomplete;