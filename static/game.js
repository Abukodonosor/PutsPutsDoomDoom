var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var player =new Player("DJOKA");

function main(){

    clear();
    update();
    render();
 
    console.log("NAJJACI SAM");
    requestAnimationFrame(main);    
}
main();


function Player (name){
    this.name = name;
    this.x = Math.floor((Math.random() * 1600) + 1);
    this.y = Math.floor((Math.random() * 800) + 1);
    this.radius = 20;
    
    this.color = random_rgba();
}

function bullet(x,y){
    this.x = x;
    this.y = y;
    this.color = "red";
}

function render(){
    // render player
    renderPlayer();
    // render bullets

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

//  player event
var up = false;
var down = false;
var left = false;
var right = false;

// bulets
var speedX;
var speedY;

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
    if( quadrant_x>0 && quadrant_y<0 ){
        side_x = 1;
        side_y = 1;
    }
    else if( quadrant_x<0 && quadrant_y<0 ){
        side_x = -1;
        side_y = 1
    }
    else if( quadrant_x<0 && quadrant_y>0 ){
        side_x = -1;
        side_y = -1;
    }
    else if( quadrant_x>0 && quadrant_y>0 ){
        side_x = 1;
        side_y = -1;
    }

    var hypot = Math.sqrt(Math.pow((quadrant_x),2)+ Math.pow((quadrant_y),2));
    var oposite = Math.sqrt(Math.pow(quadrant_y, 2));
    var adjacent = Math.sqrt(Math.pow(quadrant_x,2));


    speedX =  (adjacent/hypot)*side_x;
    speedY =  (oposite/hypot)*side_y;

    console.log("speedY:"+speedY)
    console.log("speedX:"+speedX);
    // console.log("opos:"+oposite);

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
