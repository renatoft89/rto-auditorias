const express = require('express');
const router = express.Router();
const AuditoriaController = require('../../controllers/auditorias.controller');

router.post('/', AuditoriaController.cadastrar);
router.get('/listar', AuditoriaController.listar);
router.get('/listar/:id', AuditoriaController.listarID);

module.exports = router;