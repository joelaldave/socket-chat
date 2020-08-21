const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const {crearMensaje} = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', ( data , callback ) => {


        if (!data.nombre || !data.sala) {
            return callback({
                err:true,
                mensaje:'El nombre/sala es necesario'
            })
        }

        client.join(data.sala);

        usuarios.agregarPersona( client.id, data.nombre, data.sala );
        
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));

        callback( usuarios.getPersonasPorSala(data.sala) );
    });

    client.on('crearMensaje', (data) =>{

        let persona= usuarios.getPersona(client.id);

        let mensaje = crearMensaje( persona.nombre , data.mensaje );

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje );
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.to(personaBorrada.sala).broadcast.emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat` ));

        client.to(personaBorrada.sala).broadcast.emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit( 'mensajePrivado',  crearMensaje( persona.nombre, data.mensaje) );

    })

});