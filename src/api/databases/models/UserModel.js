const connection = require('./connection');

const getAllUsers = async () => {
  const [rows] = await connection.query('SELECT * FROM');
  return rows;
}
