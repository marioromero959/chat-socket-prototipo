const { Schema, model} = require('mongoose')

const RoleSchema = new Schema({
    rol:{   //Debe tener el mismo nombre que como lo creamos en la coleccion
        type:String,
        required:[true,'El rol es obligatorio']
    }
})

module.exports = model('Role',RoleSchema)