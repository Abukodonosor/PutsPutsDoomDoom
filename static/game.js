
window.onload = function() {
    
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var socket = io.connect(window.config.ip_port);

    playersArray = [];
    player = null;

    var map= {
        x:3000,
        y:3000
    };
    offsetMaxX = map.x - canvas.width;
    offsetMaxY = map.y - canvas.height;
    offsetMinX = 0;
    offsetMinY = 0;


    socket.on('send',function (data){
        // console.log("PPLAYER:");
        console.log(socket.id);
        // player = data;
        playersArray = data.player;
        
        // on wake impuls just once when game is started on other side of planet
        for(var i = 0;i<playersArray.length;i++){
            if(playersArray[i].id == socket.id){
                player = playersArray[i];
                break;
            }
        }

        bulet_array = data.bullet;
        main();
    });



    var bulet = null;
    var bulet_array = [];


    var last_time = 0;
    var current;
    var dt;
    var time = 0;


    function main(){

        current = Date.now();
        dt = ( current  - last_time)/ 1000;
        // console.log(dt);
        clear();
        render();
        time+=dt;
        if(time > 0.5){
            data = player
            console.log(player)
            socket.emit('send', data);
            time = 0;
        }
        last_time = current;
        // requestAnimationFrame(main);
        // return false;    
    }


    function render(){
    
   
        camX = player.x - canvas.width / 2;
        camY = player.y - canvas.height / 2;
        if (camX > offsetMaxX)
            camX = offsetMaxX
        else if (camX < offsetMinX)
            camX = offsetMinX
        if (camY > offsetMaxY)
            camY = offsetMaxY
        else if (camY < offsetMinY)
            camY = offsetMinY


                ctx.save();
                ctx.translate( -camX , -camY);
                map_render();
                renderPlayer();
                renderBullets();
                ctx.restore();
        // // render player
        // renderPlayer();
        // renderBullets();
        // // render bullets

    }

    var _tWidth = 40;
    var _tHeight = 40;
    var _numTileHeight = 90;
    var _numTileWidth = 90;
    function map_render(){
    
        // var grd = ctx.createLinearGradient(0, 60, 70, 0);
        // grd.addColorStop(0, "red");
        // grd.addColorStop(1, "orange");
        // grd.addColorStop(1, "blue");
        // ctx.fillStyle = grd;
        // ctx.fillRect(0,0, map.x,map.y);
        // napravi matricu sivih kvadratasa zelenim linijama
        for (var i = 0, len = _numTileHeight; i < len; i++) {
            for (var k = 0, len2 = _numTileWidth; k < len2; k++) {
                var x = k * _tWidth,
                    y = i * _tHeight;
                    ctx.fillStyle = "#2d2b2b";
                    ctx.fillRect( x+1*k, y+1*i, _tWidth, _tHeight);
            }
        }
   
    }

    function renderBullets(){
        
        for(bulet of bulet_array){
            ctx.beginPath();
            ctx.arc(bulet.x, bulet.y, bulet.radius, 0, 2 * Math.PI);
            ctx.fillStyle = bulet.color;
            ctx.fill();
            ctx.strokeStyle='yellow';
            ctx.stroke();
        }
    }

    function renderPlayer(){

        for(var player1 of playersArray){
            ctx.beginPath();
            ctx.arc(player1.x, player1.y, player1.radius, 0, 2 * Math.PI);
            ctx.fillStyle = player1.color;
            ctx.fill();
            ctx.strokeStyle='white';
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fillText(player1.name, player1.x-15, player1.y);
        }
    }

    //  player event
    var up = false;
    var down = false;
    var left = false;
    var right = false;


    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("click", leftClick, false);

    function keyDownHandler(e){
        if(e.keyCode == 65)
            socket.emit('keyPress',{direction:'left',state:true});//left = true;
        if(e.keyCode == 68)
            socket.emit('keyPress',{direction:'right',state:true});//right = true;
        if(e.keyCode == 87)
            socket.emit('keyPress',{direction:'up',state:true});//up = true;
        if(e.keyCode == 83)
            socket.emit('keyPress',{direction:'down',state:true});//down = true;
    
        console.log(e.keyCode);
    }

    function keyUpHandler(e){
        
        if(e.keyCode == 65)
            socket.emit('keyPress',{direction:'left',state:false});//left = true;
        if(e.keyCode == 68)
            socket.emit('keyPress',{direction:'right',state:false});//right = true;
        if(e.keyCode == 87)
            socket.emit('keyPress',{direction:'up',state:false});//up = true;
        if(e.keyCode == 83)
            socket.emit('keyPress',{direction:'down',state:false});//down = true;
        
    }

    function leftClick(e){
        var c_x = e.clientX+camX;
        var c_y = e.clientY+camY;
        console.log("X:"+c_x);
        console.log("Y:"+c_y);
        socket.emit('fire',{x:c_x,y:c_y});
    }

    function random_rgba() {
        var o = Math.round, r = Math.random, s = 155;
        return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) +  ')';
    }

    function clear(){
        
        ctx.fillStyle="#ee13f9";
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    document.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;    

    main();
    }


}