const { Router } = require('express'); //Usamos la funcion Router de express
const { check } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')

const router = Router();

//Cargamos archivos
router.post('/', cargarArchivo)//Agregar validaciones

//Actualizamos los archivos
router.put('/:coleccion/:id',[
    check('id', 'El id debe ser un id de Mongo valido').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas(c, ['usuarios','productos'])), //Usamos un helper
    validarCampos
], actualizarImagenCloudinary)
// ], actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id de Mongo valido').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
],mostrarImagen)


module.exports = router;