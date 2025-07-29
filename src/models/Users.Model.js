const connection = require('../database/connection');

const cadastrarUsuario = async (usuario) => {
  const query = 'INSERT INTO usuarios (nome, email, cpf, tipo_usuario) VALUES (?, ?, ?, ?)';
  const [result] = await   connection.query(query, [usuario.nome, usuario.email, usuario.cpf, usuario.tipo_usuario]);
  return result.insertId;
}

module.exports = {
  cadastrarUsuario
};