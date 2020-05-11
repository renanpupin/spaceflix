const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

//logic modifiers (body parser and cors)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/build')));

//routes
app.get('/', function(req, res){
    res.json("SpaceFlix API.");
});

app.use('/api', require("./routes/video"));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

module.exports = app;
