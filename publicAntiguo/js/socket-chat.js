var socket = io();

var params = new URLSearchParams( window.location.search );

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat',  usuario , function( resp ) {


        console.log('Usuarios conectados ', resp);


        renderizarUsuarios(resp);
    });

});



// escucha cuando se desconecta una persona
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/* socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola desde index'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor: ', mensaje);

});

//Escuchar cambios de usuarios cuando entra o sale del chat
socket.on('listaPersonas', function(personas) {
    renderizarUsuarios(personas);
    console.log( personas );

});

//mensajes Privados

socket.on('mensajePrivado', function( mensaje ) {
    console.log('mensaje privado: ', mensaje);
})