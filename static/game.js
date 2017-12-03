var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var player = new Player("DJOKA");
var bulet=null;
function main(){

    clear();
    update();
    render();
 

    requestAnimationFrame(main);    
}
main();


function Player (name){
    this.name = name;
    this.x = Math.floor((Math.random() * canvas.width) + 1);
    this.y = Math.floor((Math.random() * canvas.height) + 1);
    this.radius = 20;
    
    this.color = random_rgba();
}

function Bullet(x_v,y_v){
    this.x = player.x;
    this.y = player.y;
    this.x_v = x_v;
    this.y_v = y_v;
    this.color = "red";
    this.radius = 5;
}

function render(){
    // render player
    renderPlayer();
    renderBullets();
    // render bullets

}

function renderBullets(){
    if(bulet!=null){
        ctx.beginPath();
        ctx.arc(bulet.x, bulet.y, bulet.radius, 0, 2 * Math.PI);
        ctx.fillStyle = bulet.color;
        ctx.fill();
        ctx.strokeStyle='yellow';
        ctx.stroke();
    }
}

function renderPlayer(){
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.strokeStyle='white';
    ctx.stroke();
}

function update(){
    // player coordinates
    updatePlayer();
    updateBullets();
    // update bullets
}

function updatePlayer(){
    if( up == true)
        player.y -= 5;
    if( down == true )
        player.y += 5;
    if( left == true)
        player.x -= 5;
    if( right == true)
        player.x += 5;
}

function updateBullets(){
    if(bulet!=null){
        bulet.x += bulet.x_v;
        bulet.y += bulet.y_v;
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
document.addEventListener("click", leftClick, false);

function keyDownHandler(e){
    if(e.keyCode == 65)
        left = true;
    if(e.keyCode == 68)
        right = true;
    if(e.keyCode == 87)
        up = true;
    if(e.keyCode == 83)
        down = true;
 
    console.log(e.keyCode);
}

function keyUpHandler(e){
    
    if(e.keyCode == 65)
        left = false;
    if(e.keyCode == 68)
        right = false;
    if(e.keyCode == 87)
        up = false;
    if(e.keyCode == 83)
        down = false;
    
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

    buletX = parseInt(speedX*10);
    buletY = parseInt(speedY*10);

    console.log("buletY:"+buletY);
    console.log("buletX:"+buletX);
    // console.log("opos:"+oposite);
    bulet = new Bullet(buletX,buletY);
    console.log(bulet)
    
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

