const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/usuarios.controller');
const { validaUsuario } = require('../../middlewares/validaUsuario');
const { validaLogin } = require('../../middlewares/validaLogin');
const { validaSenha } = require('../../middlewares/validaSenha');
const authMiddleware = require('../../middlewares/auth');

router.post('/login', validaLogin, UserController.login);

router.get('/', authMiddleware, UserController.listar);
router.get('/:id', authMiddleware, UserController.buscarPorId);
router.post('/', authMiddleware, validaUsuario, UserController.cadastrar);
router.put('/:id', authMiddleware, validaUsuario, UserController.editar);
router.patch('/senha/:id', authMiddleware, validaSenha, UserController.alterarSenha);
router.delete('/:id', authMiddleware, UserController.excluir);

module.exports = router;