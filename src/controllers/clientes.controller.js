const ClienteService = require('../services/clientes.service');

const cadastrar = async (req, res) => {
  try {
    const novoCliente = await ClienteService.cadastrarCliente(req.body);
    return res.status(201).json(novoCliente);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrar
};