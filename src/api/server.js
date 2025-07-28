const express = require('express');
const dotenv = require('dotenv');
const router = require('../api/routers/index');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});