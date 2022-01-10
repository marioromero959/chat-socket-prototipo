const { Router } = require('express'); //Usamos la funcion Router de express
const { check } = require('express-validator');
const { obtenerCategorias,
        obtenerUnaCategoria,
        crearCategoria,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');
const { idExisteCategoria } = require('../helpers/db-validators');
const { validarJWT, tieneRol } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

//Obtener todas las categorias - publico
router.get('/',obtenerCategorias)

//Obtener una categoria - publico
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(idExisteCategoria),
    validarCampos
],obtenerUnaCategoria)

//Crear una nueva categoria - privado - persona con token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria)

//Editar categorias - privado - persona con token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(idExisteCategoria),
    validarCampos
],actualizarCategoria)

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(idExisteCategoria),
    validarCampos
],borrarCategoria)

module.exports = router;