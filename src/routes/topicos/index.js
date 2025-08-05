const express = require('express');
const router = express.Router();
const TopicoController = require('../../controllers/topicos.controller');
const { validaTopico } = require('../../middlewares/validaTopicos');

router.post('/:id',validaTopico, TopicoController.cadastrar);
router.get('/', TopicoController.listar);
router.put('/:id', TopicoController.editar);
router.delete('/:id', TopicoController.apagar);
router.get('/com-perguntas', TopicoController.listarComPerguntas);

module.exports = router;