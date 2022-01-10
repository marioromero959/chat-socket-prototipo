const { Schema, model} = require('mongoose')

const CategoriaSchema = new Schema({
    nombre:{   //Debe tener el mismo nombre que como lo creamos en la coleccion
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    //Debemos saber que usuario creo la categoria
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',//Es a donde apunta el ObjectId, debe tener el mismo nombre de nuestro otro modelo
        required:true,
    }
})

CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data
}

module.exports = model('Categoria',CategoriaSchema)