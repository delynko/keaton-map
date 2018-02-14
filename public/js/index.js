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

var drawControl = new L.Control.Draw({
    draw: {
        // remove unnecessary buttons
        polyline: false,
        circle: false,
        rectangle: false,
        polygon: false,
        circlemarker:false
    },
    position: 'topright'
});

// add draw control to map
map.addControl(drawControl);

displayPoints();

var coordinates;
map.on(L.Draw.Event.CREATED, function(e){
    coordinates = [e.layer._latlng.lng, e.layer._latlng.lat];
    $('#input-form').removeClass('hidden');
});

function displayPoints(){
    $.get('/features', function(data) {
        
        for (i = 0; i < data.features.length; i++) {

            L.marker([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]])
            .bindPopup('test')
            .setIcon(new L.icon({iconUrl: "/images/marker.png", iconSize: [20, 20]}))
            .addTo(map);
            
        };
    });
}

function insertFeature(){
    var feature = {
        "type": "Feature",
        "properties": {
            "POI_NAME": $('#place').val(),
            "PARK": $('#park').val(),
            "TOWN": $('#town').val(),
            "STATE": $('#state').val(),
            "DATE_VISITED": $('#date').val(),
            "COMMENT": $('#comment').val()
            
        },
        "geometry": {
            "type": "Point",
            "coordinates": coordinates
        }
    };
    
    socket.emit('newFeatureCreated', feature);
    
    $('#input-form').addClass('hidden');
    
    $('#place').val('');
    $('#park').val('');
    $('#town').val('');
    $('#state').val('');
    $('#date').val('');
}

$('#submit-button').on('click', (function (e) {
    e.preventDefault();
    insertFeature();
}));
