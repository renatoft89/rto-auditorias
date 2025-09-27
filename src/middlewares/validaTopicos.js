const Joi = require('joi');

const topicoSchema = Joi.object({
  nome_tema: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Nome do tema deve ser um texto.',
    'string.empty': 'Nome do tema não pode estar vazio.',
    'string.min': 'Nome do tema deve ter no mínimo {#limit} caracteres.',
    'any.required': 'Nome do tema é obrigatório.',
  }),
  requisitos: Joi.string().min(3).required().messages({
    'string.base': 'Requisitos devem ser um texto.',
    'string.empty': 'Requisitos não podem estar vazios.',
    'string.min': 'Requisitos devem ter no mínimo {#limit} caracteres.',
    'any.required': 'Requisitos são obrigatórios.',
  }),
  perguntas: Joi.array().items(Joi.object({
    descricao_pergunta: Joi.string().required(),
    ordem_pergunta: Joi.number().integer().required(),
    // Adicione outros campos de pergunta se necessário (ex: id, is_active), marcando como opcionais
    id: Joi.number().integer().optional(),
    is_active: Joi.number().integer().optional(),
  })).min(1).required().messages({
    'array.base': 'Perguntas devem ser uma lista.',
    'array.min': 'É necessário ao menos uma pergunta.',
    'any.required': 'Perguntas são obrigatórias.',
  }),

  // --- LINHA ADICIONADA ---
  ordem_topico: Joi.number().integer().positive().required().messages({
    'number.base': 'A ordem do tópico deve ser um número.',
    'number.positive': 'A ordem do tópico deve ser um número positivo.',
    'any.required': 'A ordem do tópico é obrigatória.',
  }),

  // Campos opcionais que podem vir do frontend
  topico_id_original: Joi.number().integer().optional(),
  is_editing: Joi.boolean().optional(),
  is_active: Joi.number().integer().optional(),

  // Campo que adicionamos internamente para validação
  usuario_id: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),

}).options({ stripUnknown: true });

const validaTopicos = (req, res, next) => {
  const dadosCompletos = { ...req.body, usuario_id: req.usuario };

  const { error, value } = topicoSchema.validate(dadosCompletos, { abortEarly: false });

  if (error) {
    const erros = error.details.map((err) => err.message);
    return res.status(400).json({ erros });
  }

  req.body = value;
  return next();
};

module.exports = { validaTopicos };