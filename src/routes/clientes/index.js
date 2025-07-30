const express = require('express');
const router = express.Router();
const ClienteController = require('../../controllers/clientes.controller');

router.post('/', ClienteController.cadastrar);
router.get('/', ClienteController.listar);
router.put('/:id', ClienteController.editar);

module.exports = router;