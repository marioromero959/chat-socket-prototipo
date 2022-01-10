const { Router } = require('express'); //Usamos la funcion Router de express
const { check } = require('express-validator');
const { crearProducto,
        obtenerProductos,
        obtenerUnProducto,
        actualizarProducto,   
        borrarProducto } = require('../controllers/productos');
const { idExisteProducto, idExisteCategoria } = require('../helpers/db-validators');
const { validarJWT, tieneRol } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

//Obtener todos los productos - publico
router.get('/',obtenerProductos)

//Obtener un producto - publico
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(idExisteProducto),
    validarCampos
],obtenerUnProducto)

//Crear una nuevo producto - privado - persona con token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo valido').isMongoId(),
    check('categoria').custom(idExisteCategoria),
    validarCampos
],crearProducto)


//Poner validacion para que pida el nombre en el body
//Editar productos - privado - persona con token valido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de mongo valido').isMongoId(),
    check('id').custom(idExisteProducto),
    validarCampos
],actualizarProducto)

//Borrar un producto - Admin
router.delete('/:id',[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(idExisteProducto),
    validarCampos
],borrarProducto)

module.exports = router;