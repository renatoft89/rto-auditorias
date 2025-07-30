const express = require('express');
const router = express.Router();
const ClienteController = require('../../controllers/clientes.controller');

router.post('/', ClienteController.cadastrar);
router.put('/:id', ClienteController.editar);

module.exports = router;