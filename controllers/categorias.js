const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async(req, res = response) =>{
        
    const { limite = 5, desde = 0} = req.query; //Parametros que envio en la url ?param=valor&param=valor

    const [total, categorias] = await Promise.all([ //Desestructuramos el arreglo para mandar esos datos, es posicional
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
        .populate('usuario','nombre') //Asi mostramos el nombre del usuario
        .skip(Number(desde))
        .limit(Number(limite)),
    ]
    )

    res.json({
        total,
        categorias
    })

}

const obtenerUnaCategoria = async(req, res = response) =>{

    const { id } =req.params;

    const categoria = await Categoria.findById(id).populate('usuario','nombre')

    res.json(categoria)

}

const crearCategoria = async(req, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();
    
    const categoriaDB = await Categoria.findOne({nombre})

//Si la categoria existe, tira el error
    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} ya existe`
        })
    }
//Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id //El usuario debe tener el id de Mongo
    }
//Creamos la categoria nueva
    const categoria =  new Categoria(data);

//Grabamos en BD
    await categoria.save();

    res.status(201).json(categoria)
}

const actualizarCategoria = async(req, res = response) =>{
    
    const {id} = req.params;
    
    //Extraemos el usuario y el estado de la informacion
    const  { estado, usuario, ...data} = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id
    
    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true}) //El new manda el nuevo doc actualizado
    
    res.json(categoria)

}

const borrarCategoria = async(req, res = response) =>{
    
    const {id} = req.params     

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})

    res.status(200).json(categoriaBorrada)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerUnaCategoria,
    actualizarCategoria,   
    borrarCategoria
}