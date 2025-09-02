const express = require('express');
const router = express.Router();
const AuditoriaController = require('../../controllers/auditorias.controller');

router.post('/', AuditoriaController.cadastrar);
router.get('/listar', AuditoriaController.listar);
router.get('/listar/:id', AuditoriaController.listarID);
router.get('/listar-dashboard', AuditoriaController.listarDashboard);

module.exports = router;