const express = require('express');
const router = express.Router();
const ClienteController = require('../../controllers/clientes.controller');
const { validaCliente } = require('../../middlewares/validaClientes');

router.post('/',validaCliente, ClienteController.cadastrar);
router.get('/', ClienteController.listar);
router.put('/:id', ClienteController.editar);
router.delete('/:id', ClienteController.excluir);

module.exports = router;