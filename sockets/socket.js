const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('AC/DC'));
bands.addBand( new Band('Rolling Stones'));
bands.addBand( new Band('Maroon 5'));

//Mensajes de Sockets
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands()); //--> Notifica a todos los clientes conectados
    
    client.on('disconnect', () => { console.log('cliente desconectado'); });

    client.on('mensaje', (payload)=> {
        console.log('Mensaje', payload);

        io.emit('mensaje', {admin: 'Nuevo Mensaje'});
    });

    client.on('emitir-mensaje', (payload)=>{
        //console.log(payload);
        // io.emit('nuevo-mensaje', payload); // emite a todos!
        client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos al que lo emitió! 

    });

    client.on('vote-band', (payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    //escuchar add-band
    client.on('add-band', (payload)=>{
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    //borrar delete-band
    client.on('delete-band', (payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

  });