const express = require('express');
const MapboxClient = require('mapbox');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const datasetId = 'cjasgyc0v4rm231nqyggugkhi';
const client = new MapboxClient('sk.eyJ1IjoiZGVseW5rbyIsImEiOiJjamRrZnE4MDcwMDZjMzNsaTlianVmN3M5In0._Y9-xKDfWDu3vD0tKMpysQ');


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/features', (req, res) => {
    client.listFeatures(datasetId, {}, function(err, collection) {
        res.send(collection);
    });
});

io.on('connection', (socket) => {
    console.log('connected');
    
    socket.on('hello', (data) => {
        console.log(data);
    });
    
    socket.on('newFeatureCreated', (feature) => {
        client.insertFeature(feature, datasetId, function(err, feature) {
            if (err) {
                console.log(err);
            } else {
                console.log('Feature Inserted: ', feature);
            }
            
        });

    })
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
});




server.listen(port, () => {
    console.log(`listening on ${port}`)
});