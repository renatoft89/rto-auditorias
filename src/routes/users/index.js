const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users.controller');
const { validaUsuario } = require('../../middlewares/validaUsuario')

router.post('/', validaUsuario, UserController.cadastrar);

module.exports = router;