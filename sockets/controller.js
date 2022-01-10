const { Socket } = require("socket.io")
const { comprobarJWT } = require('../helpers/generar-jwt')
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(),io) =>{

    const token = socket.handshake.headers['x-token'];//Tomamos el token del front con sockets
    const usuario = await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect()
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-activos',chatMensajes.usuariosArr)
    io.emit('recibir-mensaje',chatMensajes.ultimos10)


    socket.join(usuario.id)

    //Eliminar usuario desconectado
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos',chatMensajes.usuariosArr)
    })    

    socket.on('enviar-mensaje',({uid,mensaje})=>{

        if(uid){
            //validar para msj privado
            socket.to(uid).emit('mensaje-privado',{de:usuario.nombre, mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje)//Es el que envia en mensaje
            io.emit('recibir-mensaje',chatMensajes.ultimos10)
        }
    })
}

module.exports = {
    socketController
}