-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: consultech
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `arquivos`
--

DROP TABLE IF EXISTS `arquivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arquivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_resposta` int NOT NULL,
  `tipo` enum('Foto','Video','Arquivo') NOT NULL,
  `caminho` text NOT NULL,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_resposta` (`id_resposta`),
  CONSTRAINT `arquivos_ibfk_1` FOREIGN KEY (`id_resposta`) REFERENCES `respostas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arquivos`
--

LOCK TABLES `arquivos` WRITE;
/*!40000 ALTER TABLE `arquivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `arquivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditorias`
--

DROP TABLE IF EXISTS `auditorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_cliente` int NOT NULL,
  `observacao` text,
  `dt_auditoria` date NOT NULL,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `auditorias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `auditorias_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditorias`
--

LOCK TABLES `auditorias` WRITE;
/*!40000 ALTER TABLE `auditorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `razao_social` varchar(150) NOT NULL,
  `cnpj` varchar(18) NOT NULL,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (6,'Empresa Exemplo LTDA','55.345.678/0001-90','2025-07-30 22:38:06'),(7,'teste3 Ltda','66.345.678/0001-88','2025-07-30 22:38:17'),(8,'Empresa Exemplo2 LTDA','44.345.678/000190','2025-07-30 22:46:11'),(11,'Empresa Exemplo LTDA','44.345.678/0001-88','2025-07-30 22:47:17'),(13,'Empresa3 Exemplo LTDA','44.345.678/0001-66','2025-07-30 22:48:53'),(14,'LTDA','55.345.678/0001-66','2025-07-30 23:35:37');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perguntas`
--

DROP TABLE IF EXISTS `perguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perguntas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_topico` int NOT NULL,
  `descricao_pergunta` varchar(255) NOT NULL,
  `ordem_pergunta` int NOT NULL,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pergunta_unica_topico` (`id_topico`,`descricao_pergunta`),
  UNIQUE KEY `ordem_unica_por_topico` (`id_topico`,`ordem_pergunta`),
  KEY `id_topico` (`id_topico`),
  CONSTRAINT `perguntas_ibfk_1` FOREIGN KEY (`id_topico`) REFERENCES `topicos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perguntas`
--

LOCK TABLES `perguntas` WRITE;
/*!40000 ALTER TABLE `perguntas` DISABLE KEYS */;
INSERT INTO `perguntas` VALUES (130,1,'A planilha de controle de recebimento está sendo preenchida?',1,'2025-08-05 14:03:28'),(131,1,'A data de validade é conferida no recebimento?',2,'2025-08-05 14:03:28'),(132,1,'É verificada a integridade das embalagens?',3,'2025-08-05 14:03:28'),(133,1,'As planilhas de recebimento de hortifruti, padaria e estocáveis estão sendo preenchidas e acompanhadas?',4,'2025-08-05 14:03:28'),(134,1,'Os produtos são apoiados em estrados?',5,'2025-08-05 14:03:28'),(135,1,'Veículos próprios são inspecionados?',6,'2025-08-05 14:03:28'),(136,1,'Há conferência NF x programação do pedido no ato do recebimento?',7,'2025-08-05 14:03:28'),(137,1,'Carnes e laticínios em geral: Estão com selos de Inspeção?',8,'2025-08-05 14:03:28'),(138,2,'O descongelamento / dessalgue é feito de maneira segura?',1,'2025-08-05 14:04:33'),(139,2,'Há caixa plástica / cuba específica para esta atividade?',2,'2025-08-05 14:04:33'),(140,2,'A manipulação é feita em lotes?',3,'2025-08-05 14:04:33'),(141,2,'A manipulação não excede 30 minutos em temperatura ambiente?',4,'2025-08-05 14:04:33'),(142,2,'A manipulação não excede 2 h em sala climatizada?',5,'2025-08-05 14:04:33'),(143,2,'Há preparações de véspera? São mantidas em temperatura segura?',6,'2025-08-05 14:04:33'),(144,2,'As tábuas de corte estão em bom estado de conservação?',7,'2025-08-05 14:04:33'),(145,2,'As tábuas estão identificadas por furos ou cores diferentes?',8,'2025-08-05 14:04:33'),(146,2,'Portas e janelas estão ajustadas aos batentes?',9,'2025-08-05 14:04:33'),(147,2,'A iluminação está adequada?',10,'2025-08-05 14:04:33'),(148,2,'A climatização está adequada?',11,'2025-08-05 14:04:33'),(149,2,'A utilização/ higienização da luva de malha de aço está sendo realizada de forma correta?',12,'2025-08-05 14:04:33'),(150,3,'Existe área / caixa plástica/ pia exclusiva para esta atividade?',1,'2025-08-05 14:04:47'),(151,3,'As folhas são higienizadas uma a uma?',2,'2025-08-05 14:04:47'),(152,3,'A diluição do sanitizante está correta? (conforme fabricante - rótulo da embalagem)',3,'2025-08-05 14:04:47'),(153,3,'O tempo de contato da solução com o hortifruti está sendo respeitado?',4,'2025-08-05 14:04:47'),(154,3,'A solução clorada está sendo descartada adequadamente?',5,'2025-08-05 14:04:47'),(155,3,'Há fluxograma de orientação para higienização correta do hortifruti e uso do sanitizante?',6,'2025-08-05 14:04:47'),(156,3,'Há no local alguma forma de controle do tempo? (relógio / cronômetro)',7,'2025-08-05 14:04:47'),(157,3,'Os profissionais foram treinados para executarem esta atividade?',8,'2025-08-05 14:04:47'),(158,3,'A embalagem do produto sanitizante é mantida limpa e seca, e está em local adequado?',9,'2025-08-05 14:04:47'),(159,4,'A disposição dos produtos obedecem a ordem PVPS?',1,'2025-08-05 14:45:27'),(160,4,'Todos os produtos estão dentro do prazo de validade?',2,'2025-08-05 14:45:27'),(161,4,'Todos os produtos que foram abertos e/ ou estão fora das embalagens originais são vedados e etiquetados corretamente?',3,'2025-08-05 14:45:27'),(162,4,'O estoque está organizado e limpo?',4,'2025-08-05 14:45:27'),(163,4,'As caixas de papelão quando presentes estão devidamente protegidas por saco plástico (cristal) e separados dos demais produtos?',5,'2025-08-05 14:45:27'),(164,4,'Não existem embalagens de produtos apoiadas direto ao piso?',6,'2025-08-05 14:45:27'),(165,4,'As prateleiras estão limpas e organizadas?',7,'2025-08-05 14:45:27'),(166,4,'Os alimentos são separados por característica do produto (descartável, limpeza, alimentos secos, perecíveis)?',8,'2025-08-05 14:45:27'),(167,4,'Os produtos de limpeza estão armazenados em local separado?',9,'2025-08-05 14:45:27'),(168,4,'Quando há produtos não conforme para troca e/ou devolução, são mantidos em local separado e identificados?',10,'2025-08-05 14:45:27'),(169,5,'A disposição dos produtos obedecem a ordem PVPS?',1,'2025-08-05 14:45:39'),(170,5,'Não existem produtos com prazo de validade vencido?',2,'2025-08-05 14:45:39'),(171,5,'Todos os produtos que foram abertos e/ ou estão fora das embalagens originais são vedados e etiquetados corretamente?',3,'2025-08-05 14:45:39'),(172,5,'A crosta de gelo dentro no freezer / câmara encontra-se dentro de padrões aceitáveis?',4,'2025-08-05 14:45:39'),(173,5,'O freezer / câmara está mantendo a temperatura adequada, sendo registrado em Planilha?',5,'2025-08-05 14:45:39'),(174,5,'Caixas de papelão quando presentes estão devidamente protegidas por saco plástico (cristal)?',6,'2025-08-05 14:45:39'),(175,5,'Produtos semi processados / manipulados / temperados estão devidamente identificados?',7,'2025-08-05 14:45:39'),(176,5,'Existe jaqueta térmica no local? Está limpa?',8,'2025-08-05 14:45:39');
/*!40000 ALTER TABLE `perguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respostas`
--

DROP TABLE IF EXISTS `respostas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respostas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_auditoria` int NOT NULL,
  `id_pergunta` int NOT NULL,
  `st_pergunta` enum('CF','NC','NE') NOT NULL,
  `comentario` text,
  `dt_resposta` datetime DEFAULT CURRENT_TIMESTAMP,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_auditoria` (`id_auditoria`),
  KEY `id_pergunta` (`id_pergunta`),
  CONSTRAINT `respostas_ibfk_1` FOREIGN KEY (`id_auditoria`) REFERENCES `auditorias` (`id`),
  CONSTRAINT `respostas_ibfk_2` FOREIGN KEY (`id_pergunta`) REFERENCES `perguntas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respostas`
--

LOCK TABLES `respostas` WRITE;
/*!40000 ALTER TABLE `respostas` DISABLE KEYS */;
/*!40000 ALTER TABLE `respostas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topicos`
--

DROP TABLE IF EXISTS `topicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_tema` varchar(100) NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `requisitos` text,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topicos`
--

LOCK TABLES `topicos` WRITE;
/*!40000 ALTER TABLE `topicos` DISABLE KEYS */;
INSERT INTO `topicos` VALUES (1,'1 - RECEBIMENTO DE MERCADORIAS',1,'(Requisito 7.4.3 Verificação do Produto Adquirido)','2025-08-05 13:58:03'),(2,'2 - PRÉ-PREPARO E PREPARO DE ALIMENTOS',1,'(Requisito 7.5.3 Manipulação)','2025-08-05 13:58:03'),(3,'3 - HIGIENIZAÇÃO DE HORTIFRUTI',1,'(Requisito 7.5.3 Manipulação)','2025-08-05 13:58:03'),(4,'4 - ARMAZENAMENTO DE PRODUTOS SECOS',1,'(Requisito 7.4.3 Armazenamento)','2025-08-05 13:58:03'),(5,'5 - ARMAZENAMENTO DE PRODUTOS REFRIGERADOS E CONGELADOS',1,'(Requisito 7.4.3 Armazenamento)','2025-08-05 13:58:03'),(6,'6 - MONITORAMENTO DE TEMPERATURA',1,'(Requisito 8.1.3 Ponto de Controle)','2025-08-05 13:58:03'),(7,'7 - ABASTECIMENTO E EXPOSIÇÃO',1,'(Requisito 7.5.3 Exposição)','2025-08-05 13:58:03'),(8,'8 - PÓS-PREPARO E RESFRIAMENTO',1,'(Requisito 7.5.3 Pós-Preparo)','2025-08-05 13:58:03'),(9,'9 - ARMAZENAMENTO PÓS-PREPARO',1,'(Requisito 7.4.3 Armazenamento)','2025-08-05 13:58:03'),(10,'10 - MANUTENÇÃO E LIMPEZA',1,'(Requisito 8.5.2 Manutenção)','2025-08-05 13:58:03'),(11,'11 - HIGIENE E SAÚDE DOS MANIPULADORES',1,'(Requisito 7.5.3 Manipuladores)','2025-08-05 13:58:03');
/*!40000 ALTER TABLE `topicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_usuario` enum('ADM','AUD') NOT NULL DEFAULT 'AUD',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Renato Silva','renato.silva@example.com','12345678900','2025-07-29 00:44:42','AUD');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-05 11:52:40
