const Joi = require('joi');

const schemaTopico = Joi.object({
  nome_tema: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Nome do tema deve ser uma string.',
      'string.empty': 'Nome do tema é obrigatório.',
      'string.min': 'Nome do tema deve ter pelo menos 3 caracteres.',
      'any.required': 'Nome do tema é obrigatório.',
    }),
  requisitos: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.base': 'Requisitos devem ser uma string.',
      'string.empty': 'Requisitos são obrigatórios.',
      'string.min': 'Requisitos devem ter pelo menos 5 caracteres.',
      'any.required': 'Requisitos são obrigatórios.',
    }),
  usuario_id: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'ID do usuário deve ser um número.',
      'number.integer': 'ID do usuário deve ser um número inteiro.',
      'any.required': 'ID do usuário é obrigatório.',
    }),
});

const validaTopico = (req, res, next) => {
  const data = {
    ...req.body,
    usuario_id: req.params.id,
  };

  const { error, value } = schemaTopico.validate(data, { abortEarly: false });

  if (error) {
    const erros = error.details.map(err => err.message);
    return res.status(400).json({ erros });
  }

  req.body = value;
  next();
};

module.exports = { validaTopico };