

window.onload = function() {

console.log("DJOKAAAAAA");
var socket = io.connect('http://localhost:3690');

socket.on('message', function (data) {
    var tekst = data.message+"==================";
    console.log(tekst)
    socket.emit('send', { message: tekst });
});

}