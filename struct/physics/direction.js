
var Physic = {};

Physic.mouse_direction = function(c_x,c_y,player){
    
    let acceleration = 15;

    let quadrant_x = c_x-player.x;
    let quadrant_y = c_y-player.y;
    let side_x;
    let side_y;
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

    let hypot = Math.sqrt(Math.pow((quadrant_x),2)+ Math.pow((quadrant_y),2));
    let oposite = Math.sqrt(Math.pow(quadrant_y, 2));
    let adjacent = Math.sqrt(Math.pow(quadrant_x,2));


    speedX =  (adjacent/hypot)*side_x;
    speedY =  (oposite/hypot)*side_y;

    buletX = parseInt(speedX*acceleration);
    buletY = parseInt(speedY*acceleration);
    // console.log("buletY:"+buletY);
    // console.log("buletX:"+buletX);

    return {
        x:buletX,
        y:buletY
    };
    
}



module.exports = Physic;