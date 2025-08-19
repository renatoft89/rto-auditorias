const express = require('express');
const router = express.Router();

const userRoutes = require('./users/index');
const clienteRoutes = require('./clientes/index');
const topicoRoutes = require('./topicos/index');
const perguntasRoutes = require('./perguntas/index');
const auditoriaRoutes = require('./auditorias/index');
const uploadRoutes = require('./fotos/index')

router.use('/usuarios', userRoutes);
router.use('/clientes', clienteRoutes);
router.use('/topicos', topicoRoutes);
router.use('/perguntas', perguntasRoutes);
router.use('/auditorias', auditoriaRoutes);
router.use('/uploads', uploadRoutes);


router.get('/', (_req, res) => {
  res.status(200).json({ mensagem: 'API funcionando!' });
});


module.exports = router;