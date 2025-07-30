const Joi = require('joi');

const schemaUsuario = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Nome deve ser uma string.',
      'string.empty': 'Nome é obrigatório.',
      'string.min': 'Nome deve ter pelo menos 2 letras.',
      'any.required': 'Nome é obrigatório.',
    }),

 email: Joi.string()
  .email({ tlds: { allow: false } })
  .empty('')
  .required()
  .messages({
    'string.base': 'Email deve ser um texto.',
    'string.empty': 'Email é obrigatório e não pode ser vazio.',
    'string.email': 'Formato de email inválido.',
    'any.required': 'Email é obrigatório.',
  }),

  cpf: Joi.string()
    .pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'CPF deve estar no formato 000.000.000-00.',
      'any.required': 'CPF é obrigatório.',
    }),

  tipo_usuario: Joi.string()
    .valid('ADM', 'AUD')
    .default('AUD')
    .messages({
      'any.only': 'Tipo de usuário deve ser ADM ou AUD.',
    }),
});

const validaUsuario = (req, res, next) => {
  const { error, value } = schemaUsuario.validate(req.body, { abortEarly: false });

  if (error) {
    const erros = error.details.map(err => err.message);
    return res.status(400).json({ erros });
  }
  req.body = value;
  next();
};

module.exports = { validaUsuario };