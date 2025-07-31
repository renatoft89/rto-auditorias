const express = require('express');
const router = express.Router();
const TopicoController = require('../../controllers/topicos.controller');

router.post('/:id', TopicoController.cadastrar);

module.exports = router;