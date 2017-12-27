window.onload = function() {
    
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var socket = io.connect('http://192.168.1.101:3690');



playersArray = [];
player = null;


socket.on('send',function (data){
    // console.log(data)
    // player = data;
    playersArray = data;
    main();
    
});

var bulet=null;
var bulet_array = [];


var last_time = 0;
var current;
var dt;
var time = 0;


function main(){

    current = Date.now();
    dt = ( current  - last_time)/ 1000;
    console.log(dt);
    clear();
    update();
    render();
    time+=dt;
    if(time > 0.5){
        data = player
        socket.emit('send', data);
        time = 0;
    }
    last_time = current;
    // requestAnimationFrame(main);
    // return false;    
}


function Player (name){
    this.name = name;
    this.x = Math.floor((Math.random() * canvas.width) + 1);
    this.y = Math.floor((Math.random() * canvas.height) + 1);
    this.radius = 20;
    
    this.color = random_rgba();
}

// function Bullet(x_v,y_v){
//     this.x = player.x;
//     this.y = player.y;
//     this.x_v = x_v;
//     this.y_v = y_v;
//     this.color = "red";
//     this.radius = 5;
// }

function render(){
    // render player
    renderPlayer();
    renderBullets();
    // render bullets

}

function renderBullets(){
    if(bulet_array!=[])
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

    // if(player != null){
    //     ctx.beginPath();
    //     ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    //     ctx.fillStyle = player.color;
    //     ctx.fill();
    //     ctx.strokeStyle='white';
    //     ctx.stroke();
    //     ctx.fillStyle = 'white';
    //     ctx.fillText(player.name, player.x-15, player.y);
    // }

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

function update(){
    // player coordinates
    // updatePlayer();
    //updateBullets();
    // update bullets
}

// function updatePlayer(){
//     if( up == true)
//        player.y -= 5;
//     if( down == true )
//         player.y += 5;
//     if( left == true)
//         player.x -= 5;
//     if( right == true)
//         player.x += 5;
// }


function updateBullets(){
    if(bulet_array != []){
        for(bulet of bulet_array){
            bulet.x += bulet.x_v;
            bulet.y += bulet.y_v;
        }
    }
}

//  player event
var up = false;
var down = false;
var left = false;
var right = false;

// bulets
var speedX;
var speedY;
var buletX;
var buletY;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("click", leftClick, false);

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
    var c_x = e.clientX;
    var c_y = e.clientY;
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
    bulet = new Bullet(buletX,buletY);
    bulet_array.push(bulet)
    console.log(bulet_array.length)
    
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 155;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) +  ')';
}

function clear(){
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

document.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;    

  main();
}





}