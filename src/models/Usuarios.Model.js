const connection = require('../database/connection');

const cadastrarUsuario = async (usuario) => {
  const { nome, email, cpf, tipo_usuario } = usuario;

  const query = 'INSERT INTO usuarios (nome, email, cpf, tipo_usuario) VALUES (?, ?, ?, ?)';
  const [result] = await connection.query(query, [nome, email, cpf, tipo_usuario]);
  return result.insertId;
}

const verificaUsuarioExistente = async (usuario) => {
  const { email, cpf } = usuario;

  const query = 'SELECT * FROM usuarios WHERE cpf = ? OR email = ? LIMIT 1';
  const [result] = await connection.query(query, [cpf, email]);
  
  return result.length > 0 ? result[0] : null;
};


module.exports = {
  cadastrarUsuario,
  verificaUsuarioExistente
};