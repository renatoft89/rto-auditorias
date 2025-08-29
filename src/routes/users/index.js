const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users.controller');
const { validaUsuario } = require('../../middlewares/validaUsuario');
const { validaLogin } = require('../../middlewares/validaLogin');

router.post('/', validaUsuario, UserController.cadastrar);
router.post('/login',validaLogin, UserController.login );

module.exports = router;