
var express = require('express');
var app = express();
var gameWorld = require('./gameLogic')
var ME;

app.use(express.static('static'));
app.use('/static', express.static('node_modules'));

app.get('/game',function( req, res){
    var name = req.query.name;
    ME = name;
    res.sendFile( __dirname + "/" + "index.html" );

});

app.get('/',function(req,res){
    res.sendFile( __dirname + "/" + "log.html" );
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

// socket io logic
var io = require('socket.io')(server);

CLIENT_LIST = [];
PLAYER_LIST = [];

function Player ( name, id){
    this.name = name;
    this.x = Math.floor((Math.random() * 1300) + 1);
    this.y = Math.floor((Math.random() * 600) + 1);
    this.radius = 20;
    this.id = id;
    this.color = random_rgba();

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.maxSpeed = 5;
}



io.on('connection', function(client){
    console.log('User connected ');
    data = {name: ME};

    console.log("KLIENT ID:")
    console.log(client.id);
    // napravi objekat igraca i gurni ga u niz
    CLIENT_LIST[client.id] = client;
    var player = new Player( ME, client.id);
    PLAYER_LIST[client.id] = player;

    // array of all players
    client.on('keyPress', function (move) {
        if( move.direction == 'up')
            player.up = move.state;//player.y -= 5;
        if( move.direction == 'down')
            player.down = move.state;//player.y += 5;
        if( move.direction == 'left')
            player.left = move.state;//player.x -= 5;
        if(move.direction == 'right')
            player.right = move.state;//player.x += 5;
        // obradi sto je poslao move
    });

    client.on('disconnect', function() {
        delete CLIENT_LIST[client.id];
        delete PLAYER_LIST[client.id];
    })

});



setInterval(function(){

  var pack = [];

  for( var i in PLAYER_LIST){
      var player = PLAYER_LIST[i];
      updatePlayer(player);
      pack.push(player);
  }

  for(var i in CLIENT_LIST){
      var client = CLIENT_LIST[i];
      client.emit('send',pack);
  }

},1000/30);

function updatePlayer(player){
    if( player.up == true)
        player.y -= 5;
    if( player.down == true )
        player.y += 5;
    if( player.left == true)
        player.x -= 5;
    if( player.right == true)
        player.x += 5;
}


// client.on('send', function (data) {
//     console.log(data)
//     data.x +=4;
//     console.log(data)
//     client.emit('send',data);
// });


//https://www.youtube.com/watch?v=_GioD4LpjMw
  // we need game loop here

  function random_rgba() {
    var o = Math.round, r = Math.random, s = 155;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) +  ')';
}