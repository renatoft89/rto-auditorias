const express = require('express');
const router = express.Router();

const userRoutes = require('./users/index');
const clienteRoutes = require('./clientes/index');

router.use('/usuarios', userRoutes);
router.use('/clientes', clienteRoutes);


module.exports = router;