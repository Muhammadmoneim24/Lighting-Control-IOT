var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);
 
var SerialPort = require("serialport")//.SerialPort
var serialPort = new SerialPort("/COM4", { baudRate: 9600 });
 
server.listen(8080);
app.use(express.static('views'));             
 
var brightness = 0;
 
io.sockets.on('connection', function (socket) {
        socket.on('led', function (data) {
                brightness = data.value;
               
                var buf = new Buffer(1);
                buf.writeUInt8(brightness, 0);
                serialPort.write(buf);
               
                io.sockets.emit('led', {value: brightness});   
        });
       
        socket.emit('led', {value: brightness});
});
 
console.log("Web Server Started go to 'http://localhost:8080' in your Browser.");