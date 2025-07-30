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