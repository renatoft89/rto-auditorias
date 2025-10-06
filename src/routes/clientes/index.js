const express = require('express');
const router = express.Router();
const ClienteController = require('../../controllers/clientes.controller');
const { validaCliente } = require('../../middlewares/validaClientes');
const  authMiddleware = require('../../middlewares/auth');

router.post('/',authMiddleware, validaCliente, ClienteController.cadastrar);
router.get('/', authMiddleware, ClienteController.listar);
router.put('/:id',authMiddleware ,validaCliente, ClienteController.editar);
router.delete('/:id',authMiddleware, ClienteController.excluir);

module.exports = router;