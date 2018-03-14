require('dotenv').config();
const express = require('express');
const MapboxClient = require('mapbox');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const hbs = require('hbs');

const port = process.env.PORT || 3000;

const datasetId = process.env.DATASET_ID;
const client = new MapboxClient(process.env.MAPBOX_PRIVATE);


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "hbs");

hbs.registerPartials(path.resolve(__dirname, '../views/partials'));

app.get('/', (req, res) => {
    res.render('index.hbs', {
        title: 'Keaton\'s Places Map',
        googleApiKey: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLEAPIKEY}&callback=initMap`,
        jScript: '/js/index.js',
    });
});

app.get('/edit', (req, res) => {
    res.render('edit.hbs', {
        title: 'Keaton Map Edit',
        jScript: '/js/edit.js',
    });
});

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
    });
    
    socket.on('deleteFeature', (featureId) => {
        client.deleteFeature(featureId, datasetId, function(err, feature) {
            if (!err) {
                console.log(featureId, 'deleted!');
            } else {
                console.log(err);
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