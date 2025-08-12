const ClienteService = require('../services/clientes.service');

const cadastrar = async (req, res) => {
  try {
    const novoCliente = await ClienteService.cadastrarCliente(req.body);
    return res.status(201).json({ mensagem: 'Cliente criado com Sucesso!' ,novoCliente });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const listar = async (req, res) => {
  try {
    const clientes = await ClienteService.listarClientes();
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const editar = async (req, res) => {
  const { id } = req.params;
  try {
    const clienteEditado = await ClienteService.editarCliente(id, req.body);
    return res.status(200).json(clienteEditado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const excluir = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await ClienteService.excluirCliente(id);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrar,
  listar,
  editar,
  excluir
};