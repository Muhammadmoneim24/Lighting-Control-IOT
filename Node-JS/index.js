const express = require('express')
const app = express()

const PORT = 2024

app.get('/',function(req,res){
    res.sendFile(__dirname+"/views/index1.html");
});

const server = app.listen(PORT,function(){
    console.log("Server is running at port "+ PORT);
});

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });
let led_val = 0;

wss.on('connection', function(ws){

	console.log('Client connected');

	ws.send(led_val);

	ws.on('message', function(msg){

		led_val =  msg.toString("utf-8");
		broadcast(led_val);
	});

	ws.on('close', function(){
		console.log('Client disconnected');
	});
});

function broadcast(msg) {
	wss.clients.forEach(function (client) {
		if (client.readyState === client.OPEN) { 
			client.send(msg);
		}else{
			console.log("client off");
		}
	});
}
