const connection = require('../database/connection');

const cadastrarUsuario = async (usuario) => {
  const { nome, email, cpf, tipo_usuario } = usuario;

  const query = 'INSERT INTO usuarios (nome, email, cpf, tipo_usuario) VALUES (?, ?, ?, ?)';
  const [result] = await   connection.query(query, [nome, email, cpf, tipo_usuario]);
  return result.insertId;
}

module.exports = {
  cadastrarUsuario
};