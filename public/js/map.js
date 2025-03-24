// we maked a new variable in show.ejs for the accces of the map
	mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });


    // Marker addition
    const marker1 = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates

    .setPopup( new mapboxgl.Popup({offset: 25 , })

    .setHTML(`<h4>${listing.location}</h4> <P>Exect location will be provided after Booking</P>`))

    .addTo(map);