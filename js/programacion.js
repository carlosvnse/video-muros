const fs = require('fs');
var utils = require('./utils.js');
const VideoLib = require('node-video-lib');
var programacion = {
    "ahorita": utils.now(),
    "inicio": (new Date()).getTime(),
    "datosdeOperacion": null,
    "targetsEncendidos": [],
    // ********************************************************
    "determinarDuraciondeFuente": function(indice){
        //console.log("en determinarDuraciondeFuente, sources " + JSON.stringify(programacion.sources));
		let source = programacion.sources[indice];
		if(source.tipo == "VIDEO"){
            fs.open("../videos/" + source.uri, 'r', (err, fd) => {
                try {
                    let movie = VideoLib.MovieParser.parse(fd);
                    duracion = movie.relativeDuration();
                    source.duracionDeterminada = true;
                    source.duracion = duracion;
					fs.close(fd, ()=>{
						console.log("Archivo cerrado");
					});
                    console.log("duracion de " + source.uri + ": " + source.duracion);
                } catch (ex) {
                    console.error('Error:', ex);
                }
				if((programacion.sources.length-1) == indice){
					programacion.iniciarProgramaciondeCanales(programacion);
				}else{
					programacion.determinarDuraciondeFuente(indice +1)
				}
            });
        }else{
            if((programacion.sources.length-1) == indice){
                programacion.iniciarProgramaciondeCanales(programacion);
            }else{
                programacion.determinarDuraciondeFuente(indice +1)
            }
        }

    },
    "determinarDuraciondeFuentes": function(){
        console.log("en determinarDuraciondeFuentes");
        if(programacion.sources.length > 0){
            this.determinarDuraciondeFuente(0);
        }
    },
    // ********************************************************
    "presentarSource": function(channel, source){
        channel.sourcePresentandose = source;
        channel.inicio = utils.now();
        console.log("En presentarSource: " + source.uri + ", duracion: " + source.duracion + ", inicio: " + channel.inicio);
        for(targetEncendido of this.targetsEncendidos){
            try{
                if(targetEncendido.target.idChannel == channel.idChannel ){
                    let accion = {};
                    accion.idAction = "presentarVideo";
                    accion.inicio = channel.inicio;
                    accion.source = source;
                    targetEncendido.ws.send("" + JSON.stringify(accion));
                }
            }catch(error){
            }
        }
        setTimeout(function(){
            programacion.ejecutarSourceOfSequence(channel);
        }, ((source.duracion) * 1000));
    },
    // ********************************************************
    "ejecutarSourceOfSequence": function(channel){
        if(channel.queuePautas.length > 0){
            var pauta = channel.queuePautas.shift();
            source = pauta.source;
            if(source.tipo == "VIDEO")
            {   this.presentarSource(channel, source);
            }else{
                this.ejecutarSourceOfSequence(channel);
            }

        }else{
            if(channel.indicedeSecuenciaEjecutandose == (channel.sourcesOfSequence.length - 1)){
                channel.indicedeSecuenciaEjecutandose = 0;
            }else{
                channel.indicedeSecuenciaEjecutandose++
            }
            var source = channel.sourcesOfSequence[channel.indicedeSecuenciaEjecutandose];
            if(source.tipo == "VIDEO")
            {   this.presentarSource(channel, source);
            }else{
                this.ejecutarSourceOfSequence(channel);
            }
        }
    },
    // ********************************************************
    "iniciarProgramaciondeCanales": function(p){
        for(var channel of p.channels){
            p.iniciarProgramaciondeCanal(channel);
        }

    },
    "iniciarProgramaciondeCanal": function (channel){
        console.log("iniciarProgramaciondeCanal: " + channel.idChannel);
        channel.intervalos = [];
        channel.queuePautas = [];
        channel.indicedeSecuenciaEjecutandose = -1;
        channel.eventosProgramados = []
        channel.mensajesProgramados = []
        channel.sequence = utils.findById(this.sequences, "idSequence", channel.idSequence);
		channel.sourcePresentandose = null;
		channel.inicio = -1;
        channel.sourcesOfSequence = utils.referenciarArreglo(
            this.datosdeOperacion.sources, 
            channel.sequence.sources,
            "idSource"
        );
        for (var i = channel.sourcesOfSequence.length - 1; i >= 0; i--) {
            var source = channel.sourcesOfSequence[i];
            if (source.estado != "VIGENTE") {
              channel.sourcesOfSequence.splice(i, 1);
            }
        }
        let eventsAux = utils.referenciarArreglo(
            this.datosdeOperacion.events,
            channel.events,
            "idEvent"
        );
        channel.events = eventsAux;
        for (var i = 0; i < channel.events.length; i++) {
            for (var j = 0; j < this.datosdeOperacion.sources.length; j++) {
              if (channel.events[i].idSource == this.datosdeOperacion.sources[j].idSource) {
                channel.events[i].source = this.datosdeOperacion.sources[j];
              }
            }
        }
        let pautasAux = utils.referenciarArreglo(
            this.datosdeOperacion.pautas,
            channel.pautas,
            "idPauta"
        );
        channel.pautas = pautasAux;
        for (var i = 0; i < channel.pautas.length; i++) {
            for (var j = 0; j < this.datosdeOperacion.sources.length; j++) {
              if (channel.pautas[i].idSource == this.datosdeOperacion.sources[j].idSource) {
                channel.pautas[i].source = this.datosdeOperacion.sources[j];
              }
            }
        }
        let messagesAux = utils.referenciarArreglo(
            this.datosdeOperacion.messages,
            channel.messages,
            "idMessage"
        );
        channel.messages = messagesAux
        this.ejecutarSourceOfSequence(channel);
        this.generarProgramaciondeEventos(channel);
        this.generarProgramaciondePautas(channel);
        this.generarProgramaciondeMensajes(channel);
    },
    // ********************************************************
    "generarMensajeProgramado": function(programacion, channel, message, fechaInicioMensaje, fechaFinMensaje){

        let _message = message;
        var ahora = utils.now();
        if (fechaInicioMensaje.getTime() > ahora) {
          _message.shotInicio = setTimeout(function(){programacion.desplegarMensajeProgramado(programacion, channel, _message)}, (fechaInicioMensaje.getTime() - ahora));
        }else{ 
            if(fechaFinMensaje.getTime() > ahora) {
                _message.shotInicio = setTimeout(function(){programacion.desplegarMensajeProgramado(programacion, channel, _message)}, 10000);
            }
        }
        if (fechaFinMensaje.getTime() > ahora) {
          _message.shotFinal = setTimeout(function(){programacion.terminarMensajeProgramado(programacion, channel, _message)}, (fechaFinMensaje.getTime() - ahora));
        }
        return _message;
    },
    "desplegarMensajeProgramado": function(programacion, channel, message){
        for(targetEncendido of programacion.targetsEncendidos){
            try{
                if(targetEncendido.target.idChannel == channel.idChannel ){
                    let accion = {};
                    accion.idAction = "desplegarMensaje";
                    accion.inicio = channel.inicio;
                    accion.source = source;
                    targetEncendido.ws.send("" + JSON.stringify(accion));
                }
            }catch(error){

            }
        }
        
    },
    "terminarMensajeProgramado": function(channel, message, fechaInicioMensaje, fechaFinMensaje){
        console.log("En terminarMensaje: " + JSON.stringify(message));
        for(targetEncendido of this.targetsEncendidos){
            try{
                if(targetEncendido.target.idChannel == channel.idChannel ){
                    let accion = {};
                    accion.idAction = "terminarMensaje";
                    accion.inicio = channel.inicio;
                    accion.source = source;
                    targetEncendido.ws.send("" + JSON.stringify(accion));
                }
            }catch(error){

            }
        }
    },
    "generarProgramaciondeMensajes": function(channel) {
        var ahora = utils.now();
        for (var message of channel.messages) {
            console.log("generar mensaje programado: " + JSON.stringify(message));
            var fechaInicioMensaje = utils.decodeTime(message.fechaInicio,message.horaInicio);
            var fechaFinMensaje = utils.decodeTime(message.fechaFin, message.horaFin);
            let p = this;
            if (fechaInicioMensaje.getTime() >= ahora) {
                if (ahora < fechaFinMensaje.getTime()) {
                    channel.mensajesProgramados.push( this.generarMensajeProgramado(
                        p,
                        channel,
                        message,
                        fechaInicioMensaje,
                        fechaFinMensaje
                    ));
                }
            }
            if (fechaInicioMensaje.getTime() < ahora) {
                if (ahora < fechaFinMensaje.getTime()) {
                    channel.mensajesProgramados.push( this.generarMensajeProgramado(
                        p,
                        channel,
                        message,
                        new Date(ahora + 1000),
                        fechaFinMensaje
                    ));
                }
            }
        }
    },
    // ********************************************************
    "generarPautaProgramada": function(channel, pauta) {
        let _pauta = {};
        _pauta = pauta
        _pauta.intervalo = setInterval(function() {
            console.log("----------------------programando pauta" + JSON.stringify(pauta));
            channel.queuePautas.push(pauta);
        }, pauta.intervalodeRepeticion * 1000);
        return _pauta
    },
    "generarProgramaciondePautas": function(channel) {
        var ahora = utils.now();
        for (var pauta of channel.pautas) {
          var fechaInicioPauta = utils.decodeTime(pauta.fechaInicio, pauta.horaInicio);
          var fechaFinPauta = utils.decodeTime(pauta.fechaFin, pauta.horaFin);
          if (fechaInicioPauta.getTime() <= ahora) {
            if (ahora < fechaFinPauta.getTime()) {
              console.log("creando intervalo de programación de pautas " + JSON.stringify(pauta));
              channel.intervalos.push(this.generarPautaProgramada(channel, pauta));
            }
          }
        }
    },
    // ********************************************************
    "presentarEvento": function(channel, evento) {
        console.log("presentando evento programado: " + JSON.stringify(evento));
        this.presentarSource(channel, evento.source);
    },
    "generarEventoProgramado": function(programacion, channel, evento, tiempoFaltante) {
        console.log("generando evento programado: " + JSON.stringify(evento));
        let _evento = {}
        _evento = evento;
        _evento.timeOut = setTimeout(function() {
          programacion.presentarEvento(channel, evento);
        }, tiempoFaltante);
        return _evento;
    },
    "generarProgramaciondeEventos": function(channel) {
        for (var evento of channel.events) {
            var fechadeEvento = utils.decodeTime(evento.fechaInicio, evento.horaInicio);
            var fechaActual = utils.now();
            //console.log("fechaActual: " + fechaActual);
            var tiempoFaltante = fechadeEvento.getTime() - fechaActual;
            if (tiempoFaltante > 0) {
                channel.eventosProgramados.push(this.generarEventoProgramado(programacion, channel, evento, tiempoFaltante));
            }
        }
    },
    // ********************************************************
    "generarProgramacion": function(_datos) {
        console.log("dentro de generarProgramacion, datos: " + _datos.sources);
        this.ahorita = utils.now();
        this.inicio = new Date().getTime();
        this.datosdeOperacion = _datos;
        for(var i in _datos){
            this[i] = _datos[i];
        }
        for(source of this.sources){
            source.duracionDeterminada = false;
        }
        this.determinarDuraciondeFuentes();
    },
    // ********************************************************
    "guardarProgramacion": function(_datos) {
        console.log("dentro de guardar programacion, datos: " + _datos.sources);
        
    },
    
}
module.exports = programacion;
