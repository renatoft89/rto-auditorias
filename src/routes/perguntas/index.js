const express = require('express');
const router = express.Router();
const perguntasController = require('../../controllers/perguntas.controller');

router.post('/', perguntasController.cadastrar);

module.exports = router;