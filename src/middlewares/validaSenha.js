const Joi = require('joi');

const schemaSenha = Joi.object({
  novaSenha: Joi.string().min(6).required().messages({
    'string.empty': 'A nova senha é obrigatória.',
    'string.min': 'A nova senha deve ter pelo menos 6 caracteres.',
    'any.required': 'A nova senha é obrigatória.',
  }),
});

const validaSenha = (req, res, next) => {
  const { error } = schemaSenha.validate(req.body, { abortEarly: false });

  if (error) {
    const erros = error.details.map(err => err.message);
    return res.status(400).json({ erros });
  }
  
  next();
};

module.exports = { validaSenha };