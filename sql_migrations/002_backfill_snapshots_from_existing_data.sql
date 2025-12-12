-- Backfill: criar snapshots para auditorias finalizadas existentes

-- 1) Criar snapshots de tópicos para cada auditoria finalizada que ainda não tem snapshots
INSERT INTO topicos_snapshot (id_auditoria, id_topico_original, nome_tema, requisitos, ordem_topico)
SELECT 
  a.id AS id_auditoria,
  t.id AS id_topico_original,
  t.nome_tema,
  t.requisitos,
  t.ordem_topico
FROM auditorias a
JOIN respostas r ON r.id_auditoria = a.id
JOIN perguntas p ON p.id = r.id_pergunta
JOIN topicos t ON t.id = p.id_topico
LEFT JOIN topicos_snapshot ts ON ts.id_auditoria = a.id AND ts.id_topico_original = t.id
WHERE a.st_auditoria = 'F' -- somente auditorias finalizadas
  AND ts.id IS NULL
GROUP BY a.id, t.id, t.nome_tema, t.requisitos, t.ordem_topico;

-- 2) Criar snapshots de perguntas ligadas aos tópicos snapshot
INSERT INTO perguntas_snapshot (id_auditoria, id_topico_snapshot, id_pergunta_original, descricao_pergunta, ordem_pergunta)
SELECT 
  a.id AS id_auditoria,
  ts.id AS id_topico_snapshot,
  p.id AS id_pergunta_original,
  p.descricao_pergunta,
  p.ordem_pergunta
FROM auditorias a
JOIN respostas r ON r.id_auditoria = a.id
JOIN perguntas p ON p.id = r.id_pergunta
JOIN topicos t ON t.id = p.id_topico
JOIN topicos_snapshot ts ON ts.id_auditoria = a.id AND ts.id_topico_original = t.id
LEFT JOIN perguntas_snapshot ps 
  ON ps.id_auditoria = a.id 
 AND ps.id_pergunta_original = p.id
WHERE a.st_auditoria = 'F'
  AND ps.id IS NULL
GROUP BY a.id, ts.id, p.id, p.descricao_pergunta, p.ordem_pergunta;
