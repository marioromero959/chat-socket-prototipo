const { response } = require("express")

//Con esta funcion validamos unicamente a los usuarios con rol de administrador
const validarRol = async(req, res = response, next)=>{
//Como ejecutamos este middleware despues del de JWT podemos acceder al usuario que envio en el req
    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el usuario'
        })
    }
    const {rol, nombre } = req.usuario
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg:` ${nombre} no es administrador `
        })
    }
    next()
}

const tieneRol = (...roles)=>{
    //Como los middlewares esperan de retorno una funcion hacemos esto:
    return (req, res = response, next)=>{
//Verificamos el token nuevamente
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin validar el usuario'
            })
        }
//Verificamos si tiene los roles
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            })
        }
        next();
    }
}



module.exports = {
    validarRol,
    tieneRol
}