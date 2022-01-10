const { Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre:{
        type:String,
        require:[true,'El nombre es obligatorio']
    },
    correo:{
        type:String,
        require:[true,'El correo es obligatorio'],
        unique:true
    },
    contraseña:{
        type:String,
        require:[true,'La constraseña es obligatoria']
    },
    img:{
        type:String,
    },
    rol:{
        type:String,
        require:true,
        enum:['ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'] //El rol tiene que ser uno o el otro
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
})

UsuarioSchema.methods.toJSON = function() {
    const { __v, contraseña,_id, ...usuario } = this.toObject(); //Devolvemos todo el usuario menos esos campos
    usuario.uid = _id
    return usuario
}

module.exports = model('Usuario', UsuarioSchema );
//El primer parametro es el nombre del modelo y de la conexion, mongoose le agrega la s, el segundo apramerto es el schema que creamos