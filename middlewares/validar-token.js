const { response } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')


const validarJWT = async(req, res = response, next)=>{

    const token = req.header('x-token') //Como lo ponemos ahi, es como tiene que mandar el frontend
    
    if(!token){
        return res.status(401).json({
            msg:'No hay token de validacion'
        })
    }
    try {
       
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) //Verifica si el jwt es valido
        req.uid = uid; //Enviamos la uid del token en la request para que pase por las siguientes validaciones de la ruta 
        const usuario = await Usuario.findById(uid)

//Debemos verificar si el usuario existe en la BD
        if(!usuario){
            return res.status(401).json({
                msg:'El usuario no existe en la BD'
            })
        }
//Debemos verificar el estado del usuario
        if(!usuario.estado){
            return res.status(401).json({
                msg:'El usuario no esta activo'
            })
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:'Token no valido'
        })
    }
}


module.exports = {
    validarJWT
}