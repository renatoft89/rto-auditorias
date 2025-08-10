const express = require('express');
const router = express.Router();
const AuditoriaController = require('../../controllers/auditorias.controller');

router.post('/', AuditoriaController.cadastrar);

module.exports = router;