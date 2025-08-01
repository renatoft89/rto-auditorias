const express = require('express');
const router = express.Router();

const userRoutes = require('./users/index');
const clienteRoutes = require('./clientes/index');
const topicoRoutes = require('./topicos/index');
const perguntasRoutes = require('./perguntas/index');

router.use('/usuarios', userRoutes);
router.use('/clientes', clienteRoutes);
router.use('/topicos', topicoRoutes);
router.use('/perguntas', perguntasRoutes);




module.exports = router;