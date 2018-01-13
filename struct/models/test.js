

var Player = require('./player');
var Bullet = require('./bullet')

var djoka = new Player('Djoka','kurac');
var metak = new Bullet(3,3,djoka);

console.log("IGRAC:");
console.log(djoka);
console.log("Metak:");
console.log(metak);


global.zzz='PUSI GA';

require('./djoka');