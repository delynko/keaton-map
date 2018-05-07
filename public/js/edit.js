var socket = io();

var coordinates;
var id;
var uplace;
var upark;
var utown;
var ustate;
var udate;
var ustory;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.760, lng: -95.874},
        zoom: 5
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          drawingModes: ['marker']
        },
        markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
          fillColor: '#ffff00',
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
        coordinates = [marker.getPosition().lng(), marker.getPosition().lat()];
        $('#input-form').removeClass('hidden');
    });
    displayPoints();
}

function displayPoints(){
    $.get('/features', function(data) {
        let mapStates = [];
        for (let i = 0; i < data.features.length; i++) {

            const coords = {lat: data.features[i].geometry.coordinates[1], lng: data.features[i].geometry.coordinates[0]};

            const content = 
                `<div>
                    <p>Place: ${data.features[i].properties.POI_NAME}</p><br>
                    <p>Park or Area: ${data.features[i].properties.PARK}</p><br>
                    <p>Closest Town: ${data.features[i].properties.TOWN}</p><br>
                    <p>State: ${data.features[i].properties.STATE}</p><br>
                    <p>Date: ${data.features[i].properties.DATE_VISITED}</p><br>
                    <a href="${data.features[i].properties.PHOTO}">"${data.features[i].properties.PHOTO}"</a><br>
                    <p>${data.features[i].properties.COMMENT}</p><br>
                    <p id="${data.features[i].id}">ID: ${data.features[i].id}</p><br>
                    <p id="delete"><em>Delete</em></p>
                </div>`
            ;
            
            const infowindow = new google.maps.InfoWindow({content});
            
            const icon = {
                url: '/images/marker.png',
                scaledSize: new google.maps.Size(25, 25)
            }

            const marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: icon
            });

            marker.addListener('click', function(e){
                infowindow.open(map, marker);
                id = `${data.features[i].id}`
                $('#delete').on('click', function(){
                    if (window.confirm("Are you sure you want to delete that?")) {
                        socket.emit('deleteFeature', id);
                    } else {
                        console.log('nothing happens');
                    }
                });
            });
        }
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
            "PHOTO": $('#photo').val(),
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
    $('#photo').val('');
    $('#comment').val('')
}

$('#submit-button').on('click', (function (e) {
    e.preventDefault();
    insertFeature();
}));
