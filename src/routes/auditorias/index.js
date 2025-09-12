const express = require('express');
const router = express.Router();
const AuditoriaController = require('../../controllers/auditorias.controller');
const AgendamentoController = require('../../controllers/agendamentos.controller');

// Rotas para agendamentos de auditoria
router.post('/agendar', AgendamentoController.agendar);
router.get('/agendamentos', AgendamentoController.listar);
router.delete('/agendamentos/:id', AgendamentoController.excluir);

// Rotas para auditorias
router.post('/', AuditoriaController.cadastrar);
router.get('/listar', AuditoriaController.listar);
router.get('/listar/:id', AuditoriaController.listarID);
router.get('/listar-dashboard', AuditoriaController.listarDashboard);
router.get('/data-auditoria/:clienteId', AuditoriaController.dataAuditoriaPorCliente);

module.exports = router;