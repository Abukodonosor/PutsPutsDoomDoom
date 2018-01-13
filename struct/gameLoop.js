
module.exports = function (ME,io){

    var Player = require('./models/player'),
        physic = require('./physics/direction');


    var CLIENT_LIST = [];
    var PLAYER_LIST = [];
    var BULLET_LIST = [];



    io.on('connection', function(client){
        console.log('User connected ');
        data = {name: global.ME};
    
        console.log("KLIENT ID:")
        console.log(client.id);
        // napravi objekat igraca i gurni ga u niz
        CLIENT_LIST[client.id] = client;
        var player = new Player( global.ME, client.id);

        PLAYER_LIST[client.id] = player;

        // array of all players
        client.on('keyPress', function (move) {
            if( move.direction == 'up')
                player.up = move.state;
            if( move.direction == 'down')
                player.down = move.state;
            if( move.direction == 'left')
                player.left = move.state;
            if(move.direction == 'right')
                player.right = move.state;
        });

        client.on('fire', function(bulet){
            console.log("IGRAC I METAK:");
            console.log(player);
            console.log(bulet.x,bulet.y);
            bulet = player.playerShoot( bulet.x, bulet.y, player);
            BULLET_LIST.push(bulet);
        });

        client.on('disconnect', function() {
            delete CLIENT_LIST[client.id];
            delete PLAYER_LIST[client.id];
        });

    });


    // GAME LOOP
    // replace setInterval with while(true) and to make dt at server side 
    setInterval(function(){

        var pack_player = [];
        var pack_bulet = [];
        
        for( var i in PLAYER_LIST){
            var player = PLAYER_LIST[i];
            player.updatePlayer(player);
            pack_player.push(player);
        }
    
        for( var i in BULLET_LIST){
            var bulet = BULLET_LIST[i];
            bulet.updateBullets(bulet);
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
    
    }, 1000/60);


}
