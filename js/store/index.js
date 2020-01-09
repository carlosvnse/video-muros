var datos = {
   "channels": [
      {
       "idChannel": 1,
       "nombre": "Canal 1",
       "background": "000000",
       "idSequence": 1,
       "pautas": [{"idPauta": 1 }, {"idPauta": 2 }],
       "events": [{"idEvent": 1 }, {"idEvent": 2 }],
       "messages": [{"idMessage": 1 }]
      }
    ],
   "sources": [
      {
       "idSource": 1,
       "uri": "coronita.mp4",
       "nombre": "Coronita",
       "tipo": "VIDEO",
       "estado": "VIGENTE"
      },
      {
       "idSource": 4,
       "uri": "islas.mp4",
       "nombre": "Islas",
       "tipo": "VIDEO",
       "estado": "VIGENTE"
      },
      {
       "idSource": 5,
       "uri": "pauta_beis.mp4",
       "nombre": "Pauta beis",
       "tipo": "VIDEO",
       "estado": "VIGENTE"
      }
    ],
   "targets": [
      {
       "idTarget": 1,
       "uri": "127.1.1.53",
       "nombre": "Target 1",
       "tipo": "SPLITTER",
       "numerodePantalla": 0,
       "encendido": false,
       "idChannel": 1
      },
      {
       "idTarget": 2,
       "uri": "127.1.1.54",
       "nombre": "Target 2",
       "tipo": "SPLITTER",
       "numerodePantalla": 0,
       "encendido":false,
       "idChannel": 1
      },
      {
       "idTarget": 3,
       "uri": "127.1.1.54",
       "nombre": "Target 3",
       "tipo": "SPLITTER",
       "numerodePantalla": 0,
       "encendido":false,
       "idChannel": 1
      }
    ],
   "pautas": [
      {
       "idPauta": 1,
       "nombre": "Pauta 1",
       "idSource": 5,
       "fechaInicio": "2019-10-01",
       "horaInicio": "00:00:00",
       "fechaFin": "2019-12-31",
       "horaFin": "00:00:00",
       "intervalodeRepeticion": 50,
       "interrumpirEvento":false,
       "idPanel": 1
      },
      {
       "idPauta": 2,
       "nombre": "Pauta 2",
       "idSource": 1,
       "fechaInicio": "2019-10-01",
       "horaInicio": "00:00:00",
       "fechaFin": "2019-12-31",
       "horaFin": "00:00:00",
       "intervalodeRepeticion": 75,
       "interrumpirEvento":false,
       "idPanel": 1
      }
    ],
   "events": [
      {"idEvent": 1, 
       "nombre": "partido 1", 
       "idSource": 1, 
       "fechaInicio": "2019-12-21", 
       "horaInicio": "22:12:00"
      },
      {"idEvent": 2, 
       "nombre": "partido 2", 
       "idSource": 5, 
       "fechaInicio": "2019-12-21", 
       "horaInicio": "22:13:00"
      }
    ],
   "messages": [
      {"idMessage": 1, 
       "uri": "255.1.1.5", 
       "nombre": "Mensaje 1", 
       "texto": "Mensaje 1",
       "fechaInicio": "2019-10-01",
       "horaInicio": "00:00:00",
       "fechaFin": "2019-12-31",
       "horaFin": "00:00:00",
       "idPanel": 1,
       "spinning":true 
      },
      {"idMessage": 2, 
       "uri": "255.1.1.6", 
       "nombre": "Mensaje 2", 
       "texto": "Mensaje 2",
       "fechaInicio": "2019-10-01",
       "horaInicio": "00:00:00",
       "fechaFin": "2019-12-31",
       "horaFin": "00:00:00",
       "idPanel": 1,
       "spinning":true
      }
    ],
   "panels": [
      {
       "idPanel": 1,
       "nombre": "Principal",
       "width": 100,
       "height": 10,
       "aTop": 0,
       "aLeft": 0,
       "aBottom": 0,
       "aRight": 0,
       "background": "#000000",
       "opacity": 1,
       "center":false,
       "zIndex": 0,
       "style": ""
      },
      {
       "idPanel": 2,
       "nombre": "Panel 2",
       "width": 10,
       "height": 10,
       "aTop": 10,
       "aLeft": 10,
       "aBottom": 10,
       "aRight": 10,
       "background": "#000000",
       "opacity": 0.5,
       "center":false,
       "zIndex": 0,
       "style": ""
      },
      {
       "idPanel": 3,
       "nombre": "Panel 3",
       "width": 10,
       "height": 10,
       "aTop": 10,
       "aLeft": 10,
       "aBottom": 10,
       "aRight": 10,
       "background": "#000000",
       "opacity": 0.5,
       "center":false,
       "zIndex": 0,
       "style": ""
      }
    ],
   "sequences": [
      {
       "idSequence": 1,
       "nombre": "Secuencia 1",
       "sources": [{"idSource": 1 }, {"idSource": 2 }, {"idSource": 3}, {"idSource": 5 }]
      }
    ],
   "rsss": []
  }

  module.exports = datos;