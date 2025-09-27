const express = require('express');
const router = express.Router();
const perguntasController = require('../../controllers/perguntas.controller');
const authMiddleware = require('../../middlewares/auth');

router.put('/status/:id', authMiddleware, perguntasController.atualizarStatus);

module.exports = router;