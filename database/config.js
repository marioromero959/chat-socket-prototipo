const mongoose = require('mongoose') //Requerimos el paquete de mongoose

const dbConexion = async () =>{

    try {
        
       await mongoose.connect(process.env.MONGODB_ALTLAS,{
           useNewUrlParser:true,
           useUnifiedTopology:true,
       })   //Regresa una promesa
       console.log('Base de datos online')
    } catch (error) {
        console.log(error)
        if (error){
            throw new Error('BD Failed')
        }
    }

}


module.exports = {
    dbConexion
}