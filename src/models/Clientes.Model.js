const connection = require('../database/connection');

const cadastrarCliente = async (cliente) => {
  const { razao_social, cnpj } = cliente;

  const query = 'INSERT INTO clientes ( razao_social, cnpj) VALUES (?, ?)';
  const [result] = await connection.query(query, [razao_social, cnpj]);
  return result.insertId;
}

const editarCliente = async (id, cliente) => {
  const { razao_social, cnpj } = cliente;

  const query = 'UPDATE clientes SET razao_social = ?, cnpj = ? WHERE id = ?';
  const [result] = await connection.query(query, [razao_social, cnpj, id]);
  return result.affectedRows;
}

module.exports = {
  cadastrarCliente,
  editarCliente
}; 
