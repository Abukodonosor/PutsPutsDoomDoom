
var express = require('express');
var app = express();
var gameWorld = require('./gameLogic')
global.ME = '';

app.use(express.static('static'));
app.use('/static', express.static('node_modules'));

app.get('/game',function( req, res){
    var name = req.query.name;
    global.ME = name;
    res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/',function(req,res){
    res.sendFile( __dirname + "/" + "log.html" );
});

app.get('/pesmica',function( req, res){
    res.send("<a href='https://www.youtube.com/watch?v=hyxrqPoPAtM' >Klikni ovde </a>")
});

app.get('/desi*', function(req, res) {   
    console.log("Got a GET request for /ab*cd");
    res.send('Page Pattern Match');
 })

var server = app.listen(3690, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server listening on http://%s:%s", host, port);
});

// socket io communication medium
var io = require('socket.io')(server);

require('./struct/gameLoop')(ME,io);