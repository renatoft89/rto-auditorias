const express = require('express');
const router = express.Router();

const userRoutes = require('./users/index');
const clienteRoutes = require('./clientes/index');
const topicoRoutes = require('./topicos/index');

router.use('/usuarios', userRoutes);
router.use('/clientes', clienteRoutes);
router.use('/topicos', topicoRoutes);



module.exports = router;