const { v4:uuidv4 } = require('uuid');
const path = require('path')//Sirve para cambiar urls

const subirArchivo = (files, carpeta = '') =>{//Le pedimos al front el archivo y que especifique la carpeta

    return new Promise((resolve, reject) =>{

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.'); //Corta el string cuando encuentra ese signo
        const extension = nombreCortado[nombreCortado.length - 1]
    
        //Validar la extension
        const extensionesPermitidas = ['png','jpeg','jpg']
        
        if(!extensionesPermitidas.includes(extension)){
            return reject(`Las extensiones permitidas son ${extensionesPermitidas}`)
        }
    
        const nombreTemporal = uuidv4() + '.' + extension//Generamos un nombre unico para cada archivo con el que lo guardamos en BD
        const uploadPath = path.join(__dirname, '../uploads/',carpeta, nombreTemporal);
      
        archivo.mv(uploadPath, (err) => {
          if (err) {
            return reject(err)
          }
          resolve(nombreTemporal);
        });
    })

}   


module.exports = {
    subirArchivo
}