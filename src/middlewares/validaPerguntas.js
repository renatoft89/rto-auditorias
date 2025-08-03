const Joi = require('joi');

const schemaPerguntas = Joi.object({
  id_topico: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'ID do tópico deve ser um número.',
      'number.integer': 'ID do tópico deve ser um número inteiro.',
      'any.required': 'ID do tópico é obrigatório.',
    }),
  descricao_pergunta: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.base': 'Descrição da Pergunta deve ser uma string.',
      'string.empty': 'Descrição da Pergunta é obrigatória.',
      'string.min': 'Descrição da Pergunta deve ter pelo menos 5 caracteres.',
      'any.required': 'Descrição da Pergunta é obrigatória.',
    }),
  ordem_pergunta: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Ordem da pergunta deve ser um número.',
      'number.integer': 'Ordem da pergunta deve ser um número inteiro.',
      'any.required': 'Ordem da pergunta é obrigatória.',
    }),
}); 

const validaPerguntas = (req, res, next) => {
  console.log('Validando perguntas:', req.body);
  
  const { error, value } = schemaPerguntas.validate(req.body, 
    { abortEarly: false,
      convert: false,
     });

  if (error) {
    const erros = error.details.map(err => err.message);
    return res.status(400).json({ erros });
  }
  
  req.body = value;
  next();
}

module.exports = { validaPerguntas };