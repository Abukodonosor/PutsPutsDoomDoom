var express = require('express');
var app = express();

app.use(express.static('static'));

app.get('/',function( req, res){
    res.sendFile( __dirname + "/" + "index.html" );
    // res.send("Gde si bre gilipteru");
});

app.get('/pesmica',function( req, res){
    res.send("<a href='https://www.youtube.com/watch?v=hyxrqPoPAtM'>Klikni ovde </a>")
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