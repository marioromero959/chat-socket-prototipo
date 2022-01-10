const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

//Usualmente las peticiones de busqueda se realizan por get,  se mandan los parametros por la url
const router = Router();

router.get('/:coleccion/:termino', buscar)

module.exports = router;
