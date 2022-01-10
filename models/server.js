const express = require('express');
const cors = require('cors');
const { dbConexion } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller')


// En esta clase creams todo lo necesario para inicilizar la app
class Server{
    constructor(){
        this.app = express() //Creamos la aplicacion como una propiedad de la clase server
        this.port = process.env.PORT
        //Configuracion para sockets
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server)

        // Estos son los endpoints disponibles 
        this.userPath = '/api/users';
        this.authPath = '/api/auth';
        this.buscarPath = '/api/buscar';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.uploadsPath = '/api/uploads';
        
        //Conectamos la BD
        this.conectarBD()

        // Middlewares
        this.middlewares()
        
        // rutas de la aplicacion
        this.routes()

        //Sockets
        this.sockets()
    }

    //Conexion a BD
    async conectarBD(){
        await dbConexion();
    }

    middlewares(){
        //CORS
         this.app.use(cors()) //Leer documentacion

        // Parseo y lectura del body
        // Es para aclarar el tipo de informacion que recibimos
        this.app.use(express.json())

        // Directorio publico
        this.app.use( express.static('public'))

        //File Upload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true //Crea la carpeta si no existe
        }));
    }

    // Aca podemos cargar los demas enpoints
    routes(){
       this.app.use(this.authPath, require('../routes/auth')) //Llama a las rutas creadas en routes/auth.js
       this.app.use(this.buscarPath, require('../routes/buscar')) 
       this.app.use(this.userPath, require('../routes/user')) 
       this.app.use(this.categoriasPath, require('../routes/categorias')) 
       this.app.use(this.productosPath, require('../routes/productos')) 
       this.app.use(this.uploadsPath, require('../routes/uploads')) 
    }


    sockets(){
        this.io.on('connection',(socket)=> socketController(socket,this.io))
    }


    listen(){
        this.server.listen(this.port,()=>{
            console.log('Escuchando el puerto:',this.port)
        })
    }
}

module.exports = Server;