var socket = io();

var mapboxStreets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGVseW5rbyIsImEiOiJjaXBwZ3hkeTUwM3VuZmxuY2Z5MmFqdnU2In0.ac8kWI1ValjdZBhlpMln3w'
});

var map = L.map("map", {
    maxZoom: 18,
    layers: [mapboxStreets],
}).setView([38.760, -95.874], 5);
map.zoomControl.setPosition('topright');

displayPoints();

function displayPoints(){
    $.get('/features', function(data) {
        for (i = 0; i < data.features.length; i++) {
            
            var point = L.marker([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]])
            .bindPopup(`<p class="hidden" id="id">${data.features[i].id}</p>Place: ${data.features[i].properties.POI_NAME}<br>Park or Area: ${data.features[i].properties.PARK}<br>Closest Town: ${data.features[i].properties.TOWN}<br>State: ${data.features[i].properties.STATE}<br>Date: ${data.features[i].properties.DATE_VISITED}<br><a href="${data.features[i].properties.PHOTO}" target="_blank">Photo</a>`)
            .setIcon(new L.icon({iconUrl: "/images/marker.png", iconSize: [25, 25]}));
            
            map.addLayer(point);
            
        };
    });
}

