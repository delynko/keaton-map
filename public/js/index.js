var socket = io();

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.760, lng: -95.874},
        zoom: 5
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
                    <img src="${data.features[i].properties.PHOTO}"><br>
                    <p>${data.features[i].properties.COMMENT}</p>
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

            marker.addListener('click', function(){
                infowindow.open(map, marker);
            });
        }
    });
}
