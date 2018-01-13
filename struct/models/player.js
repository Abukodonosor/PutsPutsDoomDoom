var psyhic = require('../physics/direction'),
    Bullet = require('./bullet');

class Player{

    constructor(name, id){
        this.name = name;
        this.x = Math.floor((Math.random() * 1300) + 1);
        this.y = Math.floor((Math.random() * 600) + 1);
        this.radius = 20;
        this.id = id;
        this.color = this.random_rgba();

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.maxSpeed = 5;
    }

    updatePlayer(player){
        if( player.up == true)
            player.y -= this.maxSpeed;
        if( player.down == true )
            player.y += this.maxSpeed;;
        if( player.left == true)
            player.x -= this.maxSpeed;;
        if( player.right == true)
            player.x += this.maxSpeed;;
    }

    playerShoot( bulet_x, bulet_y, player){

        let direction = psyhic.mouse_direction( bulet_x, bulet_y, player);
        let bullet = new Bullet( direction.x, direction.y, player);
        return bullet;

    }

    random_rgba(){
        let o = Math.round, r = Math.random, s = 155;
        return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) +  ')';
    }

}

module.exports = Player;