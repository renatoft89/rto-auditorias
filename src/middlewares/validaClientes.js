const Joi = require('joi');

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
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'E-mail é obrigatório.',
      'string.email': 'E-mail inválido.',
      'any.required': 'E-mail é obrigatório.',
    }),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{4,5}\-\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Telefone deve estar no formato (00) 00000-0000.',
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
  const { error, value } = schemaCliente.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true // Ignora o que não está no schema "ID"
  });

  if (error) {
    const erros = error.details.map(err => err.message);
    return res.status(400).json({ erros });
  }
  req.body = value;
  next();
};

module.exports = { validaCliente };