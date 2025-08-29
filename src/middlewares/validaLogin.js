const Joi = require('joi');

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required()
    .messages({
      'string.base': 'Email deve ser um texto.',
      'string.empty': 'Email é obrigatório e não pode ser vazio.',
      'string.email': 'Formato de email inválido.',
      'any.required': 'Email é obrigatório.',
    }),

  senha: Joi.string()
    .trim()
    .required()
    .messages({
      'string.base': 'Senha deve ser um texto.',
      'string.empty': 'Senha é obrigatória e não pode ser vazia.',
      'any.required': 'Senha é obrigatória.',
    }),
});

const validaLogin = (req, res, next) => {
  const { error } = schemaLogin.validate(req.body, { abortEarly: false });

  if (error) {
    const erros = error.details.map((err) => err.message);
    return res.status(400).json({ erros });
  }

  next();
};

module.exports = { validaLogin };