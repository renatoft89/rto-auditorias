const AuditoriasService = require('../services/auditorias.service');

const cadastrar = async (req, res) => {
  try {
    const novaAuditoria = await AuditoriasService.cadastrarAuditoria(req.body);
    return res.status(201).json({ mensagem: 'Auditoria cadastrada com sucesso!', novaAuditoria });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  cadastrar
};