const { validationResult } = require('express-validator');

// Los middlewares tienen un 3er argumento next, al que llamamos cuando se termina de ejecutar
const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json(errores)
    }
    next();
}

module.exports = {
    validarCampos
}