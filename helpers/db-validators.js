const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

const esRolValido = async(rol='') =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const emailExiste = async(correo = '') =>{
    const existeEmail = await Usuario.findOne({correo})
    if(existeEmail){
        throw new Error(`El email ${correo} ya se encuentra en uso`)
    }
}

const idExiste = async(id) =>{
    const existeId = await Usuario.findById(id)
    if(!existeId){
        throw new Error(`El id ingresado no existe`)
    }
}
const idExisteCategoria = async(id) =>{
    const existeId = await Categoria.findById(id)
    if(!existeId){
        throw new Error(`El id ingresado no existe`)
    }
}
const idExisteProducto = async(id) =>{
    const existeId = await Producto.findById(id)
    if(!existeId){
        throw new Error(`El id ingresado no existe`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
    const incluye = colecciones.includes(coleccion)
    if(!incluye){
        throw new Error(`${coleccion} no es permitido, intente con: ${colecciones}`)
    }
    return true;
}



module.exports = {
    esRolValido,
    emailExiste,
    idExiste,
    idExisteCategoria,
    idExisteProducto, 
    coleccionesPermitidas,
}