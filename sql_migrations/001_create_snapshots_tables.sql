-- Criação das tabelas de snapshot

CREATE TABLE IF NOT EXISTS topicos_snapshot (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_auditoria INT(11) NOT NULL,
  id_topico_original INT(11) NOT NULL,
  nome_tema VARCHAR(100) NOT NULL,
  requisitos TEXT NULL,
  ordem_topico INT(11) NULL,
  dt_snapshot DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ts_auditoria FOREIGN KEY (id_auditoria) REFERENCES auditorias(id) ON DELETE CASCADE,
  CONSTRAINT fk_ts_topico_original FOREIGN KEY (id_topico_original) REFERENCES topicos(id)
);

CREATE TABLE IF NOT EXISTS perguntas_snapshot (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_auditoria INT(11) NOT NULL,
  id_pergunta_original INT(11) NOT NULL,
  id_topico_snapshot INT(11) NOT NULL,
  descricao_pergunta VARCHAR(255) NOT NULL,
  ordem_pergunta INT(11) NOT NULL,
  dt_snapshot DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ps_auditoria FOREIGN KEY (id_auditoria) REFERENCES auditorias(id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_pergunta_original FOREIGN KEY (id_pergunta_original) REFERENCES perguntas(id),
  CONSTRAINT fk_ps_topico_snapshot FOREIGN KEY (id_topico_snapshot) REFERENCES topicos_snapshot(id) ON DELETE CASCADE
);
