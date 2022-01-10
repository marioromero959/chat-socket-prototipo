const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async(req, res = response) =>{
        
    const { limite = 5, desde = 0} = req.query; //Parametros que envio en la url ?param=valor&param=valor

    const [total, productos] = await Promise.all([ //Desestructuramos el arreglo para mandar esos datos, es posicional
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
        .populate('usuario','nombre') //Asi mostramos el nombre del usuario
        .populate('categoria','nombre') 
        .skip(Number(desde))
        .limit(Number(limite)),
    ]
    )

    res.json({
        total,
        productos
    })

}

const obtenerUnProducto = async(req, res = response) =>{

    const { id } =req.params;

    const producto = await Producto.findById(id)
                    .populate('usuario','nombre')
                    .populate('categoria','nombre')

    res.json(producto)

}

const crearProducto = async(req, res = response) =>{

    const {estado, usuario, ...body} = req.body
    const productoDB = await Producto.findOne({nombre:body.nombre.toUpperCase()})
//Si la categoria existe, tira el error
    if(productoDB){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre} ya existe`
        })
    }
//Generar la data a guardar
    const data = {
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario: req.usuario._id //El usuario debe tener el id de Mongo
    }
//Creamos la categoria nueva
    const producto =  new Producto(data);

//Grabamos en BD
    await producto.save();

    res.status(201).json(producto)
}

const actualizarProducto = async(req, res = response) =>{
    
    const {id} = req.params;
    
    //Extraemos el usuario y el estado de la informacion
    const  { estado, usuario, ...data} = req.body

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase()
    }
    data.usuario = req.usuario._id
    
    const producto = await Producto.findByIdAndUpdate(id,data,{new:true})
    
    res.json(producto)

}

const borrarProducto = async(req, res = response) =>{
    
    const {id} = req.params     

    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false},{new:true})

    res.status(200).json(productoBorrado)
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerUnProducto,
    actualizarProducto,   
    borrarProducto
}