const { request } = require('express');
const { io } = require('../server');
const  { Usuarios } = require('../classes/usuario')
const { crearMensjae } = require('../utilidades/utilidades')

const usuarios = new Usuarios();

io.on('connection', ( client ) => {

    
    client.on('entrarChat' , ( data , callback ) => {
        
        console.log('Bien server');
        
        if( !data.nombre ||  !data.sala ){
            return callback({
                error : true,
                mensaje : 'EL nombre y la sala es necesario'
            })
        }

        client.join(data.sala); // ESTO ES LO QUE HACE POSIBLE QUE PODAMOS CREAR UNA SALA

        usuarios.agregarPersona( client.id , data.nombre , data.sala )

        // client.broadcast.emit('listaPersonas' , usuarios.getPersonas()) //ESTO ES PARA PODER AMIIR UN MENSAJE A TODOS LOS DEL CHAT LA LINEA DE ABAJO SIRVE PARA LOS CHAT EN GRUPOS
        io.sockets.to( data.sala ).emit('listaPersonas' , usuarios.getPersonasPorSala( data.sala ))
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensjae('administrador', `${ data.nombre } se unio`));
        //  console.log(usuarios.getPersonasPorSala( data.sala )); 

        callback( usuarios )
        
    })

    client.on('crearMensaje' , (data , callback ) => {

        let persona = usuarios.getPersona( client.id )
        
        let mensaje = crearMensjae( persona.nombre , data.mensaje );

        client.broadcast.to(persona.sala).emit( 'crearMensaje' , mensaje )

        callback( mensaje )
        
    } )
    
    
    client.on('disconnect' , () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to( personaBorrada.sala ).emit('crearMensaje' ,  crearMensjae('administrador' , `${ personaBorrada.nombre } abandono el chat `))
        client.broadcast.to( personaBorrada.sala ).emit('listaPersonas' ,  usuarios.getPersonasPorSala( personaBorrada.sala ))
        
    })

    // Mensjaes privados 
    client.on('mensajePrivado' , data => {

        let persona = usuarios.getPersona( client.id );
        client.broadcast.to(data.para).emit('mensajePrivado' , crearMensjae( persona.nombre , data.mensaje ) ); //el to() sive par enviar un mensaje privado y entre paraentesis esta el id
        
    } )

});
