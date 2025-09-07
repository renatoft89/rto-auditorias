const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('joi');

app.use(bodyParser.json());

const ClienteModel = {
  clientes: [],

  async verificaClienteExistente(dados) {
    return this.clientes.find(cliente => cliente.cnpj === dados.cnpj);
  },

  async cadastrarCliente(dados) {
    const novoCliente = {
      id: this.clientes.length + 1,
      ...dados
    };
    this.clientes.push(novoCliente);
    return novoCliente.id;
  }
};

const schemaCliente = Joi.object({
  razao_social: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.base': 'Razão social deve ser uma string.',
      'string.empty': 'Razão social é obrigatória.',
      'string.min': 'Razão social deve ter pelo menos 6 caracteres.',
      'any.required': 'Razão social é obrigatória.',
    }),
  cnpj: Joi.string()
    .pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'CNPJ deve estar no formato 00.000.000/0000-00.',
      'any.required': 'CNPJ é obrigatório.',
    }),
  responsavel: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Nome do responsável é obrigatório.',
      'string.min': 'O nome do responsável deve ter pelo menos 3 caracteres.',
      'any.required': 'Nome do responsável é obrigatório.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail é obrigatório.',
      'string.email': 'E-mail inválido.',
      'any.required': 'E-mail é obrigatório.',
    }),
  telefone: Joi.string()
    .required()
    .messages({
      'string.empty': 'Telefone é obrigatório.',
      'any.required': 'Telefone é obrigatório.',
    }),
  endereco: Joi.string()
    .min(5)
    .required()
    .messages({
      'string.empty': 'Endereço é obrigatório.',
      'string.min': 'Endereço deve ter pelo menos 5 caracteres.',
      'any.required': 'Endereço é obrigatório.',
    }),
});

const validaCliente = (req, res, next) => {
  const { error, value } = schemaCliente.validate(req.body, { abortEarly: false });

  if (error) {
    const erros = error.details.map(err => err.message);
    return res.status(400).json({ erros });
  }
  req.body = value;
  next();
};

module.exports = { validaCliente };
