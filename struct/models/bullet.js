
class Bullet{

    constructor(x_v,y_v,player){
        this.x = player.x;
        this.y = player.y;
        this.x_v = x_v;
        this.y_v = y_v;
        this.color = "red";
        this.radius = 5;
    }

    updateBullets(bulet){
        bulet.x += bulet.x_v;
        bulet.y += bulet.y_v;
    }   

}

module.exports = Bullet;