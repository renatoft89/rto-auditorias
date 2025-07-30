const connection = require('../database/connection');

const cadastrarCliente = async (cliente) => {
  const { razao_social, cnpj } = cliente;

  const query = 'INSERT INTO clientes ( razao_social, cnpj) VALUES (?, ?)';
  const [result] = await connection.query(query, [razao_social, cnpj]);
  return result.insertId;
}

const listarClientes = async () => {
  const query = 'SELECT * FROM clientes';
  const [result] = await connection.query(query);
  return result;
}

const editarCliente = async (id, cliente) => {
  const { razao_social, cnpj } = cliente;

  const query = 'UPDATE clientes SET razao_social = ?, cnpj = ? WHERE id = ?';
  const [result] = await connection.query(query, [razao_social, cnpj, id]);
  return result.affectedRows;
}

const excluirCliente = async (id) => {
  const query = 'DELETE FROM clientes WHERE id = ?';
  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
}

module.exports = {
  cadastrarCliente,
  listarClientes,
  editarCliente,
  excluirCliente
}; 
