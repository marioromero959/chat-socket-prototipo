
//Estas constantes contienen todo los que exportan esos archivos

const  validarCampos = require("../middlewares/validar-campos");
const  validarJWT = require('../middlewares/validar-token');
const  validarRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}