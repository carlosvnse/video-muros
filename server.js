const fs = require('fs');
const VideoLib = require('node-video-lib');
var WebSocketServer = require('ws').Server;
var datos = require('./js/store/index.js');
var programacion = require('./js/programacion.js');

var interval = null;
var targets = [];
var idConnection = 0;

function presentarSourceActual(targetEncendido){
	let accion = {};
	let channel = null;
	accion.idAction = "presentarSourceActual";
	for(var _channel of programacion.channels){
		if(targetEncendido.target.idChannel == _channel.idChannel){
			console.log("channel encontrado");
			channel = _channel
			break;
		}else{
			console.log("channel no encontrado");
		}
	}
	accion.source = channel.sourcePresentandose
    accion.inicio = channel.inicio
    enviarAccion(targetEncendido.ws, accion);
}
function registrarTarget(mensaje){
    for(targetEncendido of programacion.targetsEncendidos){
        if(targetEncendido.idConnection == mensaje.idConnection){
            targetEncendido.target = mensaje;
			presentarSourceActual(targetEncendido);
        }
    }
}
function enviarAccion(ws, accion){
    ws.send(JSON.stringify(accion))
}
var wss = new WebSocketServer({ port: 8080 }); // If you want to add a path as well, use path: "PathName"
wss.on('connection', function connection(_ws) {
    let ws = _ws;
    ws.on('message', function incoming(message) {
        procesarMensaje(ws, message);
    });
    let _idConnection = idConnection + 0;
    ws.on('close', function close(){
        cerrarConeccion(_idConnection);
    });
    programacion.targetsEncendidos.push({"ws": ws, "idConnection": idConnection});
    console.log("targets encendidos: " + programacion.targetsEncendidos.length);
    ws.send('{"idAction": "registrarConexion", "conexionExitosa": true, "idConnection":'  + idConnection + '}');
    idConnection++;
});
function cerrarConeccion(id){
    console.log("cerrando idConnection: " + id)
    for( var i = 0; i < programacion.targetsEncendidos.length; i++){
       // console.log("targetEncendido: " + JSON.stringify(programacion.targetsEncendidos[i]));
        if(id == programacion.targetsEncendidos[i].idConnection){
            console.log("target encendido "+ id + " encontrado");
            programacion.targetsEncendidos.splice(i, 1);
        }
    }
    
}
function procesarMensaje(ws, message){
    message = JSON.parse(message);
    switch(message.idAction){
        case "registrarTarget":
            registrarTarget(message);
            break;
        case "guardarProgramacion":
            programacion.guardarProgramacion(message);
            break;
    }
}
programacion.generarProgramacion(datos);
console.log("server ws on port 8080");