const bcryptjs = require("bcryptjs");
const { response } = require("express");

const Usuario = require('../models/usuario')
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
// const { json } = require("express/lib/response");

const login = async(req,res = response)=>{
    const {correo,contraseña} = req.body
    try {
// Verificar si el email existe y si el usuario esta ativo
    const usuario = await Usuario.findOne({correo})
    if(!usuario){
        return res.status(400).json({
            msg:'El correo ingresado no es correcto'
        })
    }
    if(!usuario.estado){
        return res.status(400).json({
            msg:'El correo ingresado no es correcto - por estado'
        })
    }

// Verificar la contraseña
    const validarConstraseña = bcryptjs.compareSync(contraseña, usuario.contraseña)
    if(!validarConstraseña){
        return res.status(400).json({
            msg:'El correo ingresado no es correcto - por contraseña'
        })
    }

// Generar JWT
    const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })    
    } catch (error) {
        console.log(error);
        return res.status(500).json('Algo salio mal');
    }


}

const loginGoogle = async(req, res = response)=>{
    const { id_token } = req.body;

    try {
        const {nombre,img,correo} = await googleVerify(id_token);//Obtenemos los datos que mandamos en el helper
        let usuario = await Usuario.findOne({correo})

        //Si el usuario no existe en la BD, hay que crearlo
        if(!usuario){
            const data = {
                nombre,
                correo,
                contraseña:'pass',
                img,
                google:true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }
        //Si el usuario en BD tiene estado:false
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, este usuario esta bloqueado'
            })
        }
        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })        
    } catch (error) {
        res.status(400).json({
            msg:'El token no se pudo verificar'
        })
    }


}

const renovarToken = async(req, res = response) =>{

    const {usuario} = req;

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    loginGoogle,
    renovarToken
}