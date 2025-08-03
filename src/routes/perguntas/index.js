const express = require('express');
const router = express.Router();
const perguntasController = require('../../controllers/perguntas.controller');
const { validaPerguntas } = require('../../middlewares/validaPerguntas');

router.post('/',validaPerguntas, perguntasController.cadastrar);

module.exports = router;