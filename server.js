
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
BULLET_LIST = [];

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

function Bullet(x_v,y_v,player){
    this.x = player.x;
    this.y = player.y;
    this.x_v = x_v;
    this.y_v = y_v;
    this.color = "red";
    this.radius = 5;
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

    client.on('fire', function(bulet){
        console.log(bulet.x,bulet.y);
        createBullet(bulet.x,bulet.y,player);
    });

    client.on('disconnect', function() {
        delete CLIENT_LIST[client.id];
        delete PLAYER_LIST[client.id];
    })

});



setInterval(function(){

  var pack_player = [];
  var pack_bulet = [];

  for( var i in PLAYER_LIST){
      var player = PLAYER_LIST[i];
      updatePlayer(player);
      pack_player.push(player);
  }

  for( var i in BULLET_LIST){
      var bulet = BULLET_LIST[i];
      updateBullets(bulet);
      pack_bulet.push(bulet);
  }

  var pack = {
      player:pack_player,
      bullet:pack_bulet
  };

  for(var i in CLIENT_LIST){
      var client = CLIENT_LIST[i];
      client.emit('send',pack);
  }

},1000/60);


// update coordinates of players
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

function updateBullets(bulet){
    
    bulet.x += bulet.x_v;
    bulet.y += bulet.y_v;

}

function createBullet(c_x,c_y,player){
    console.log("X:"+c_x);
    console.log("Y:"+c_y);
    
    var quadrant_x = c_x-player.x;
    var quadrant_y = c_y-player.y;
    var side_x;
    var side_y;
    // prvi kvadrant
    if( quadrant_x>0 && quadrant_y<0 ){
        side_x = 1;
        side_y = -1;
    }// drugi kvadrant
    else if( quadrant_x<0 && quadrant_y<0 ){
        side_x = -1;
        side_y = -1
    }// cetvrti kvadrant  
    else if( quadrant_x>0 && quadrant_y>0 ){
        side_x = 1;
        side_y = 1;
    }// treci kvadrant 
    else if( quadrant_x<0 && quadrant_y>0 ){
        side_x = -1;
        side_y = 1;
    }

    var hypot = Math.sqrt(Math.pow((quadrant_x),2)+ Math.pow((quadrant_y),2));
    var oposite = Math.sqrt(Math.pow(quadrant_y, 2));
    var adjacent = Math.sqrt(Math.pow(quadrant_x,2));


    speedX =  (adjacent/hypot)*side_x;
    speedY =  (oposite/hypot)*side_y;

    buletX = parseInt(speedX*15);
    buletY = parseInt(speedY*15);

    console.log("buletY:"+buletY);
    console.log("buletX:"+buletX);
    // console.log("opos:"+oposite);
    bulet = new Bullet(buletX,buletY,player);
    BULLET_LIST.push(bulet)
    // // bulet_array.push(bulet)
    // console.log(bulet)
    
}


function updateBullets(bulet){
    
            bulet.x += bulet.x_v;
            bulet.y += bulet.y_v;
    
}


//https://www.youtube.com/watch?v=_GioD4LpjMw
  // we need game loop here

  function random_rgba() {
    var o = Math.round, r = Math.random, s = 155;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) +  ')';
}