const fs = require('fs');
const VideoLib = require('node-video-lib');
var utils = {
    "decodeTime": function(fecha, hora){
        var dateRegexp = /^(\d{4})\-(\d\d)\-(\d\d)$/gi;
        var date = new Date();
        if(fecha.match(dateRegexp))
        { date.setFullYear(parseInt(RegExp.$1));
          date.setMonth(parseInt(RegExp.$2) - 1);
          date.setDate(parseInt(RegExp.$3));
        }
        var timeRegexp = /(\d\d)\:(\d\d)\:(\d\d)/gi;
        if(hora.match(timeRegexp))
        { date.setHours(parseInt(RegExp.$1));
          date.setMinutes(parseInt(RegExp.$2));
          date.setSeconds(parseInt(RegExp.$3));
        }
        return date;
    },
    "findById": function(coleccion, identificador, id){
        for(var i = 0; i < coleccion.length; i++){
          if(coleccion[i][identificador] == id){
            return coleccion[i];
          }
        }
        return null;
    },
    "now": function(){
        var fecha = new Date().getTime();
        return fecha;
    },
    "referenciarArreglo": function(arregloOrigen, arregloaReferenciar, identificador){
        var arreglo = [];
        for(var i = 0; i < arregloaReferenciar.length; i++){
          for(var j = 0; j < arregloOrigen.length; j++){
            if(arregloaReferenciar[i][identificador] == arregloOrigen[j][identificador]){
              arreglo.push(arregloOrigen[j]);
            }
          }
        }
        return arreglo;
    },
    "obtenerDuraciondeVideo": (videoFile)=>{
        let duracion = 0;
        fs.open(videoFile, 'r', (err, fd) => {
            try {
                console.log("archivo abierto: " + fd);
                let movie = VideoLib.MovieParser.parse(fd);
                // Work with movie
                duracion = movie.relativeDuration();
            } catch (ex) {
                console.error('Error:', ex);
            }
        });
        return duracion;

    }
}
module.exports = utils;
