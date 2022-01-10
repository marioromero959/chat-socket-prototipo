const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models')
//Estas son las colecciones que se pueden consultar
const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response)=>{
//Verificamos si lo que nos envia es un id de mongo
    const esMongoId = ObjectId.isValid(termino); 

    if(esMongoId){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    const regexp = new RegExp(termino, 'i') //Hace que sea insensible a las minusculas y mayusculas
    const usuarios = await Usuario.find({
        $or: [{nombre: regexp},{correo:regexp}],
        $and: [{estado:true}]
    }) //Devuelve si coincide el nombre o el correo y si esta activo

    res.json({
        results:usuarios
    })
}

const buscarCategorias = async(termino = '', res = response)=>{
    //Verificamos si lo que nos envia es un id de mongo
        const esMongoId = ObjectId.isValid(termino); 
    
        if(esMongoId){
            const categoria = await Categoria.findById(termino)
            return res.json({
                results: (categoria) ? [categoria] : []
            })
        }
        const regexp = new RegExp(termino, 'i') //Hace que sea insensible a las minusculas y mayusculas
        const categorias = await Categoria.find({nombre: regexp,estado:true}) 
    
        res.json({
            results:categorias
        })
    }

    const buscarProductos = async(termino = '', res = response)=>{
    //Verificamos si lo que nos envia es un id de mongo
        const esMongoId = ObjectId.isValid(termino); 
    
        if(esMongoId){
            const producto = await Producto.findById(termino)
            return res.json({
                results: (producto) ? [producto] : []
            })
        }
        const regexp = new RegExp(termino, 'i') 
        const productos = await Producto.find({nombre: regexp,estado:true}) 
        res.json({
            results:productos
        })
    }

const buscar = (req, res = response)=>{

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;
        case 'categoria':
            buscarCategorias(termino, res)
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
        case 'roles':
        
        break;
        default:
            res.status(500).json({
                msg:'Esta busqueda actualmente no esta activa'
            })
    }

}
module.exports = {
    buscar
}