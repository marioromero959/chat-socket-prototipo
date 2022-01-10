const jwt = require('jsonwebtoken')
const { Usuario } = require('../models')

// No debemos grabar informacion sensible ene el JWT
const generarJWT = ( uid = '')=>{

    return new Promise((resolve, reject)=>{ //Hacemos que la funcion sea una promesa asi podemos usar el await

        const payload = { uid }

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn:'4h' //Podemos mandar cuanto queremos que dure el jwt
        },
        (err,token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el jwt')
            }else{
                resolve(token)
            }
        })
    })
}

const comprobarJWT = async(token = '') =>{
    try {
        if(token.length < 10){
            return null;
        }

        const { uid } = jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        const usuario = await Usuario.findById(uid)

        if(usuario && usuario.estado){
            return usuario;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}


module.exports = {
    generarJWT,
    comprobarJWT
}