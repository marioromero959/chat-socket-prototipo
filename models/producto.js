const { Schema, model} = require('mongoose')

const ProductoSchema = new Schema({
    nombre:{   //Debe tener el mismo nombre que como lo creamos en la coleccion
        type:String,
        required:[true,'El nombre del producto es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',//Es a donde apunta el ObjectId, debe tener el mismo nombre de nuestro otro modelo
        required:true,
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required:true,
    },
    descripcion:{type:String},
    disponible:{
        type:Boolean,
        default:true
    },
    img:{type:String}
})

ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data
}

module.exports = model('Producto',ProductoSchema)