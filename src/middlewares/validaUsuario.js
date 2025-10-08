const Joi = require('joi');

const schemaBase = {
  nome: Joi.string().min(3).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/).required(),
  tipo_usuario: Joi.string().valid('ADM', 'AUD').required(),
};

const schemaCriacao = Joi.object({
  ...schemaBase,
  senha: Joi.string().min(6).required(),
});

const schemaEdicao = Joi.object({
  ...schemaBase,
});

const validaUsuario = (req, res, next) => {
  const schema = req.method === 'POST' ? schemaCriacao : schemaEdicao;

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    messages: {
      'string.empty': 'O campo {#label} é obrigatório.',
      'string.min': 'O campo {#label} deve ter no mínimo {#limit} caracteres.',
      'string.email': 'O formato do e-mail é inválido.',
      'string.pattern.base': 'O formato do CPF é inválido.',
      'any.required': 'O campo {#label} é obrigatório.',
      'any.only': 'O valor do campo {#label} não é permitido.'
    }
  });

  if (error) {
    const erros = error.details.map(err => err.message.replace(/"/g, ''));
    return res.status(400).json({ erros });
  }

  req.body = value;
  next();
};

module.exports = { validaUsuario };