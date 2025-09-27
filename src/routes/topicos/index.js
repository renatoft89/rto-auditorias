const express = require('express');
const topicosController = require('../../controllers/topicos.controller');
const authMiddleware = require('../../middlewares/auth');
const { validaTopicos } = require('../../middlewares/validaTopicos');

const router = express.Router();

router.post('/', authMiddleware, validaTopicos, topicosController.cadastrarTopico);
router.get('/com-perguntas', authMiddleware, topicosController.listarTopicosComPerguntas);
router.post('/salvar-edicao', authMiddleware, validaTopicos, topicosController.salvarTopicoEditado);
router.put('/status/:id', authMiddleware, topicosController.atualizarStatus);
router.delete('/:id', authMiddleware, topicosController.excluirTopico);


module.exports = router;