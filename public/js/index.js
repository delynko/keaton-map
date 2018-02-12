var socket = io();

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVseW5rbyIsImEiOiJjaXBwZ3hkeTUwM3VuZmxuY2Z5MmFqdnU2In0.ac8kWI1ValjdZBhlpMln3w';
/* eslint-disable */
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-95.874, 40.760], // starting position
    zoom: 3.5
});

var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        point: true,
        trash: true
    }
});
map.addControl(draw);

displayPoints();

var coordinates;

map.on('draw.create', (e) => {
    
    coordinates = (e.features[0].geometry.coordinates);

    $('#input-form').removeClass('hidden');
});


function displayPoints() {
    $.get('/features', function(data) {
    
        for (i = 0; i < data.features.length; i++) {
        
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = 'url(images/marker.png';
        
            new mapboxgl.Marker(el)
            .setLngLat([data.features[i].geometry.coordinates[0], data.features[i].geometry.coordinates[1]])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`Place: ${data.features[i].properties.POI_NAME}<br>Park or Area: ${data.features[i].properties.PARK}<br>Date Visited: ${data.features[i].properties.DATE_VISITED}`))
            .addTo(map);
        };
    });
}



$('#submit-button').on('click', (function (e) {
    e.preventDefault();
    
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
    setTimeout(function(){
        location.reload();
    },1000)
    
}));
