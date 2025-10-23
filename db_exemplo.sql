-- MySQL dump 10.13  Distrib 9.4.0, for Linux (x86_64)
--
-- Host: localhost    Database: consultech
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agendamentos`
--

DROP TABLE IF EXISTS `agendamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `data_auditoria` date NOT NULL,
  `observacoes` text,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `agendamentos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendamentos`
--

LOCK TABLES `agendamentos` WRITE;
/*!40000 ALTER TABLE `agendamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `agendamentos` ENABLE KEYS */;
UNLOCK TABLES;

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
  `st_auditoria` enum('A','F') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A' COMMENT 'Status da auditoria: A=Andamento, F=Finalizada',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `auditorias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `auditorias_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditorias`
--

LOCK TABLES `auditorias` WRITE;
/*!40000 ALTER TABLE `auditorias` DISABLE KEYS */;
INSERT INTO `auditorias` VALUES (1,1,1,'','2025-10-23','2025-10-23 11:55:49','A');
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
  `responsavel` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `dt_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Teste LTDA','41.587.965/0001-54','Teste teste','teste@teste.com','(00) 00000-0000','rua teste numero 00','2025-09-06 18:50:00','2025-09-07 13:08:52'),(4,'ODS Digital LTDA','35.614.129/0001-74','Renato','renatoft89@gmail.com','(68) 99994-9896','Av. São José dos Campos','2025-09-27 21:46:31','2025-09-27 21:46:31');
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
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `pergunta_unica_topico` (`id_topico`,`descricao_pergunta`),
  UNIQUE KEY `ordem_unica_por_topico` (`id_topico`,`ordem_pergunta`),
  KEY `id_topico` (`id_topico`),
  CONSTRAINT `perguntas_ibfk_1` FOREIGN KEY (`id_topico`) REFERENCES `topicos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perguntas`
--

LOCK TABLES `perguntas` WRITE;
/*!40000 ALTER TABLE `perguntas` DISABLE KEYS */;
INSERT INTO `perguntas` VALUES (1,15,'A planilha de controle de recebimento está sendo preenchida ?',1,'2025-10-22 23:23:32',1),(2,15,'A data de validade é conferida no recebimento?',2,'2025-10-22 23:23:32',1),(3,15,'É verificada a integridade das embalagens?',3,'2025-10-22 23:23:32',1),(4,15,'As planilhas de recebimento de hortifruti, padaria e estocáveis estão sendo preenchidas e acompanhadas?',4,'2025-10-22 23:23:32',1),(5,15,'Os produtos são apoiados em estrados?',5,'2025-10-22 23:23:32',1),(6,15,'Veículos próprios são inspecionados?',6,'2025-10-22 23:23:32',1),(7,15,'Há conferência NF x programação do pedido no ato do recebimento?',7,'2025-10-22 23:23:32',1),(8,15,'Carnes e laticínios em geral: Estão com selos de Inspeção?',8,'2025-10-22 23:23:32',1),(21,17,'O descongelamento / dessalgue é feito de maneira segura?',1,'2025-10-23 00:21:35',1),(22,17,'Há caixa plástica / cuba específica para esta atividade? ',2,'2025-10-23 00:21:35',1),(23,17,'A manipulação é feita em lotes?',3,'2025-10-23 00:21:35',1),(24,17,'A manipulação não excede 30 minutos em temperatura ambiente?',4,'2025-10-23 00:21:35',1),(25,17,'A manipulação não excede 2 h em sala climatizada?',5,'2025-10-23 00:21:35',1),(26,17,'Há preparações de véspera? São mantidas em temperatura segura?',6,'2025-10-23 00:21:35',1),(27,17,'As tábuas de corte estão em bom estado de conservação?',7,'2025-10-23 00:21:35',1),(28,17,'As tábuas estão identificadas por furos ou cores diferentes?',8,'2025-10-23 00:21:35',1),(29,17,'Portas e janelas estão ajustadas aos batentes?',9,'2025-10-23 00:21:35',1),(30,17,'A utilização/ higienização da luva de malha de aço está sendo realizada de forma correta?',10,'2025-10-23 00:21:35',1),(31,17,'A iluminação é adequada?',11,'2025-10-23 00:21:35',1),(32,17,'A climatização é adequada?',12,'2025-10-23 00:21:35',1),(33,18,'Existe área / caixa plástica/ pia exclusiva para esta atividade? ',1,'2025-10-23 00:24:43',1),(34,18,'As folhas são higienizadas uma a uma?',2,'2025-10-23 00:24:43',1),(35,18,'A diluição do sanitizante está correta? (conforme fabricante - rótulo da embalagem)',3,'2025-10-23 00:24:43',1),(36,18,'O tempo de contato da solução com o hortifruti está sendo respeitado?',4,'2025-10-23 00:24:43',1),(37,18,'A solução clorada está sendo descartada adequadamente?',5,'2025-10-23 00:24:43',1),(38,18,'Há fluxograma de orientação para higienização correta do hortifruti e uso do sanitizante?',6,'2025-10-23 00:24:43',1),(39,18,'Há no local alguma forma de controle do tempo? (relógio / cronômetro)',7,'2025-10-23 00:24:43',1),(40,18,'Os profissionais foram treinados para executarem esta atividade?',8,'2025-10-23 00:24:43',1),(41,18,'A embalagem do produto sanitizante é mantida limpa e seca, e está em local adequado?',9,'2025-10-23 00:24:43',1),(42,19,'A disposição dos produtos obedecem a ordem PVPS?',1,'2025-10-23 00:35:49',1),(43,19,'Todos os produtos estão dentro do prazo de validade?',2,'2025-10-23 00:35:49',1),(44,19,'Todos os produtos que foram abertos e/ ou estão fora das embalagens originais são vedados e etiquetados corretamente?',3,'2025-10-23 00:35:49',1),(45,19,'O estoque está organizado e limpo?',4,'2025-10-23 00:35:49',1),(46,19,'As caixas de papelão quando presentes estão devidamente protegidas por saco plástico (cristal) e separados dos demais produtos?',5,'2025-10-23 00:35:49',1),(47,19,'Não existem embalagens de produtos apoiadas direto ao piso?',6,'2025-10-23 00:35:49',1),(48,19,'As prateleiras estão limpas e organizadas?',7,'2025-10-23 00:35:49',1),(49,19,'Os alimentos são separados por característica do produto (descartável, limpeza, alimentos secos, perecíveis)?',8,'2025-10-23 00:35:49',1),(50,19,'Os produtos de limpeza estão armazenados em local separado?',9,'2025-10-23 00:35:49',1),(51,19,'Quando há produtos não conforme para troca e/ou devolução, são mantidos em local separado e identificados?',10,'2025-10-23 00:35:49',1),(52,20,'A disposição dos produtos obedecem a ordem PVPS?',1,'2025-10-23 00:40:10',1),(53,20,'Não existem produtos com prazo de validade vencido?',2,'2025-10-23 00:40:10',1),(54,20,'Todos os produtos que foram abertos e/ ou estão fora das embalagens originais são vedados e etiquetados corretamente?',3,'2025-10-23 00:40:10',1),(55,20,'A crosta de gelo dentro no freezer / câmara encontra-se dentro de padrões aceitáveis?',4,'2025-10-23 00:40:10',1),(56,20,'O freezer / câmara está mantendo a temperatura adequada, sendo registrado em Planilha?',5,'2025-10-23 00:40:10',1),(57,20,'Caixas de papelão quando presentes estão devidamente protegidas por saco plástico (cristal)?',6,'2025-10-23 00:40:10',1),(58,20,'Existe jaqueta térmica no local, e está limpa?',7,'2025-10-23 00:40:10',1),(59,20,'A jaqueta está limpa e bem conservada?',8,'2025-10-23 00:40:10',1),(60,20,'Produtos semiprocessados/manipulados/temperados estão devidamente identificados?',9,'2025-10-23 00:40:10',1),(61,21,'A disposição dos produtos obedecem a ordem PVPS?',1,'2025-10-23 00:44:27',1),(62,21,'Todos os produtos que foram abertos e/ ou estão fora das embalagens originais são vedados e etiquetados corretamente?',2,'2025-10-23 00:44:27',1),(63,21,'Alimentos prontos/semiprontos/crus estão dispostos adequadamente na geladeira e etiquetados corretamente conforme necessário?',3,'2025-10-23 00:44:27',1),(64,21,'Não existem produtos com prazo de validade vencido?',4,'2025-10-23 00:44:27',1),(65,21,'Não existe crosta de gelo dentro da geladeira/câmara?',5,'2025-10-23 00:44:27',1),(66,21,'Não há gotejamento de água dentro da geladeira?',6,'2025-10-23 00:44:27',1),(67,21,'A geladeira está mantendo a temperatura de acordo com o tipo de produto? Há registro em planilha?',7,'2025-10-23 00:44:27',1),(68,21,'Está limpa e em bom estado de conservação?',8,'2025-10-23 00:44:27',1),(69,22,'Os equipamentos estão em bom estado de conservação e limpeza?',1,'2025-10-23 00:48:06',1),(70,22,'O sistema de exaustão está funcionando e bom estado de conservação e limpeza? ',2,'2025-10-23 00:48:06',1),(71,22,'O sistema de exaustão possui telas?',3,'2025-10-23 00:48:06',1),(72,22,'Os utensílios estão em perfeitas condições de uso e estão higienizados corretamente?',4,'2025-10-23 00:48:06',1),(73,22,'Os utensílios estão guardados em local apropriado, organizados e livres de contaminações?',5,'2025-10-23 00:48:06',1),(74,22,'O forno, fogão, caldeira, fritadeira estão em bom estado de conservação e limpeza?',6,'2025-10-23 00:48:06',1),(75,22,'Os equipamentos de medição balança e termômetro estão calibrados?',7,'2025-10-23 00:48:06',1),(76,22,'Os equipamentos de medição estão conservados em boas condições de higiene?',8,'2025-10-23 00:48:06',1),(77,22,'As caixas plásticas estão em bom estado de conservação e limpeza?',9,'2025-10-23 00:48:06',1),(78,22,'Não existem equipamentos/utensílios e, desuso que atrapalham a operação? ',10,'2025-10-23 00:48:06',1),(79,22,'Existe cronograma de manutenção de equipamentos?',11,'2025-10-23 00:48:06',1),(80,23,'Todos os locais do estabelecimento são mantidos limpos e organizados?',1,'2025-10-23 00:51:48',1),(81,23,'A higienização está sendo registrada em planilha?',2,'2025-10-23 00:51:48',1),(82,23,'Locais como: atrás do freezer, refrigerador, embaixo de bancadas, prateleiras estão limpos?',3,'2025-10-23 00:51:48',1),(83,23,'Utensílios de limpeza, como rodos, esfregão e outros de uso de banheiros, estão separados e/ou identificados dos da produção?',4,'2025-10-23 00:51:48',1),(84,23,'Rodos, esfregões e pás são guardados em local fora da área de produção?',5,'2025-10-23 00:51:48',1),(85,23,'Os banheiros são independentes para cada sexo, identificados e de uso exclusivo para manipuladores de alimentos?',6,'2025-10-23 00:51:48',1),(86,23,'As Instalações sanitárias são dotadas de produtos destinados a higiene pessoal (papel higiênico,sabonete líquido antisséptico, toalhas de papel não recicláveis  para as mãos) e lixeira com acionamento com pedal?',7,'2025-10-23 00:51:48',1),(87,23,'Os produtos de limpeza e desinfecção são registrados no MS (Ministério da Saúde)?',8,'2025-10-23 00:51:48',1),(88,23,'Não são utilizados panos de algodão, panos de prato, para secagem de louças? (exceção: em cafeterias/ para polimento)',9,'2025-10-23 00:51:48',1),(89,23,'Na desinfecção (utensílios) está sendo usado álcool 70% ?',10,'2025-10-23 00:51:48',1),(90,23,'Os EPIs necessários para os processos de higienização estão sendo utilizados? (luvas de borracha, avental de plástico)',11,'2025-10-23 00:51:48',1),(91,23,'Uniformes/aventais são guardados em local próprio?',12,'2025-10-23 00:51:48',1),(92,23,'Todos os borrifadores de álcool são mantidos limpos e identificados?',13,'2025-10-23 00:51:48',1),(93,24,'As bancadas são higienizadas antes e depois da manipulação dos alimentos?',1,'2025-10-23 00:56:02',1),(94,24,'Os profissionais utilizam luva descartável na manipulação de preparação prontas para consumo?',2,'2025-10-23 00:56:02',1),(95,24,'Os equipamentos e/ou utensílios que entram em contato com alimento pronto é previamente limpo e desinfetado?',3,'2025-10-23 00:56:02',1),(96,24,'Alimentos crus não entram em contato com alimentos cozidos?',4,'2025-10-23 00:56:02',1),(97,24,'Na cocção os alimentos atingem temperatura de segurança? (74⁰C ou mais no centro geométrico), registrado em planilhas?',5,'2025-10-23 00:56:02',1),(98,24,'É utilizado EPIs em bom estado para atividades que envolvem cocção e fritura? (avental antichama, mangote, óculos de proteção, luva térmica)?',6,'2025-10-23 00:56:02',1),(99,25,'Alimentos que aguardam distribuição ficam em temperaturas de segurança? (conferir no dia da Auditoria)',1,'2025-10-23 00:58:14',1),(100,25,'As entregas estão sendo realizadas dentro de um tempo aceitável pelo cliente?',2,'2025-10-23 00:58:14',1),(101,25,'A temperatura dos alimentos na distribuição é monitorada e anotada em planilhas?',3,'2025-10-23 00:58:14',1),(102,25,'O balcão térmico está em bom estado de conservação e limpeza? ',4,'2025-10-23 00:58:14',1),(103,25,'A temperatura do balcão térmico esta entre 80° C e 90° C?',5,'2025-10-23 00:58:14',1),(104,25,'É feita a coleta, identificação e o armazenamento de amostras conforme Manual de Boas Práticas?',6,'2025-10-23 00:58:14',1),(105,25,'O restaurante está sendo limpo durante a distribuição?',7,'2025-10-23 00:58:14',1),(106,25,'A área de devolução está organizada e limpa?',8,'2025-10-23 00:58:14',1),(107,26,'Coletores de lixo estão limpos e identificados, com saco plástico?',1,'2025-10-23 00:59:27',1),(108,26,'Os coletores de lixo possuem tampa com acionamento por pedal?',2,'2025-10-23 00:59:27',1),(109,26,'Os coletores de lixo são colocados em locais adequados, afastados do fogão e das bancadas de manipulação de alimentos?',3,'2025-10-23 00:59:27',1),(110,26,'O lixo fora da cozinha fica em local fechado, isento de moscas, roedores e outros animais?',4,'2025-10-23 00:59:27',1),(111,26,'Quando há cruzamento da saída do lixo e matérias-primas, são determinados horários diferentes?',5,'2025-10-23 00:59:27',1),(112,27,'A desinsetização e desratização é realizada periodicamente?',1,'2025-10-23 02:31:32',1),(113,27,' Colaboradores relatam a eficiência do controle de pragas?',2,'2025-10-23 02:31:32',1),(114,27,'A limpeza do reservatório (caixa d\' água) está sendo realizada periodicamente conforme procedimento? Comprovado em documento?',3,'2025-10-23 02:31:32',1),(115,27,'A análise da água está sendo realizada periodicamente?',4,'2025-10-23 02:31:32',1),(116,27,'A Licença Sanitária está atualizada?',5,'2025-10-23 02:31:32',1),(117,28,'As práticas utilizadas para a distribuição de refeições transportadas estão conforme procedimento?',1,'2025-10-23 02:35:21',1),(118,28,'Os hot box estão limpos e em bom estado de conservação?',2,'2025-10-23 02:35:21',1),(119,28,'O veículo utilizado para o transporte possui alvará de funcionamento?',3,'2025-10-23 02:35:21',1),(120,28,'O motorista responsável pelo transporte possui habilitação comprovada em CNH?',4,'2025-10-23 02:35:21',1),(121,28,'O veículo para o transporte está limpo?',5,'2025-10-23 02:35:21',1),(122,28,'Os recipientes contendo alimentos são colocados em estrados no interior do veículo, de forma organizada?',6,'2025-10-23 02:35:21',1),(123,28,'Há evidência do controle de temperatura de saída dos alimentos por planilha?',7,'2025-10-23 02:35:21',1),(124,29,'Todos os profissionais estão com as unhas aparadas, limpas e sem esmalte?',1,'2025-10-23 02:37:32',1),(125,29,'Não usam adornos (aliança, anéis, brincos, cílios postiços, piercieng em local aparente)?',2,'2025-10-23 02:37:32',1),(126,29,' Não usam barba e bigode?',3,'2025-10-23 02:37:32',1),(127,29,'Profissionais e visitantes usam proteção para os cabelos (touca) cobrindo as orelhas?',4,'2025-10-23 02:37:32',1),(128,29,'Existe pia exclusiva para higienização das mãos?',5,'2025-10-23 02:37:32',1),(129,29,'A pia de higiene das mãos não é utilizada para outros fins?',6,'2025-10-23 02:37:32',1),(130,29,'Quando não há pia exclusiva é determinado um local para higiene das mãos?',7,'2025-10-23 02:37:32',1),(131,29,'Higienizam as mãos seguindo os procedimentos?',8,'2025-10-23 02:37:32',1),(132,29,'Há na pia de higienização das mãos sabonete bactericida (sem cheiro) e papel toalha branco- não reciclado?',9,'2025-10-23 02:37:32',1),(133,29,'Todos os profissionais estão uniformizados e limpos?',10,'2025-10-23 02:37:32',1),(134,29,'Todos os profissionais do estabelecimento utilizam sapato de segurança e/ou bota de PVC?',11,'2025-10-23 02:37:32',1),(135,29,'Não há profissionais com ferimentos nas mãos / micose nas unhas/outras doenças evidentes?',12,'2025-10-23 02:37:32',1);
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
  `st_pergunta` enum('CF','NC','PC','NE') NOT NULL,
  `comentario` text,
  `dt_resposta` datetime DEFAULT CURRENT_TIMESTAMP,
  `dt_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_auditoria_pergunta` (`id_auditoria`,`id_pergunta`),
  KEY `id_auditoria` (`id_auditoria`),
  KEY `id_pergunta` (`id_pergunta`),
  CONSTRAINT `respostas_ibfk_1` FOREIGN KEY (`id_auditoria`) REFERENCES `auditorias` (`id`),
  CONSTRAINT `respostas_ibfk_2` FOREIGN KEY (`id_pergunta`) REFERENCES `perguntas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `ordem_topico` int DEFAULT NULL,
  `versao_anterior_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_id` (`usuario_id`),
  KEY `fk_versao_anterior` (`versao_anterior_id`),
  CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_versao_anterior` FOREIGN KEY (`versao_anterior_id`) REFERENCES `topicos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topicos`
--

LOCK TABLES `topicos` WRITE;
/*!40000 ALTER TABLE `topicos` DISABLE KEYS */;
INSERT INTO `topicos` VALUES (15,'RECEBIMENTO DE MERCADORIAS',1,'(Requisito7.4.3 Verificação do Produto Adquirido)','2025-10-22 23:23:32',1,1,NULL),(17,'MANIPULAÇÃO DE CARNES',1,'(Requisitos 7.5.1 - Controle de Produção e Prestação de Serviço / 7.5.3 Identificação e Rastreabilidade/ 7.5.5 Preservação do Produto)','2025-10-23 00:21:35',1,2,NULL),(18,'HIGIENIZAÇÃO DE HORTIFRUTI',1,'(Requisitos 6.2.2 Competência Treinamento e Conscientização/ 7.5.1 - Controle de Produção e Prestação de Serviço / 7.5.3 Identificação e Rastreabilidade/ 7.5.5 Preservação do Produto/ 8.2.3 Monitoramente e Medição de Processos)','2025-10-23 00:24:43',1,3,NULL),(19,'ARMAZENAMENTO (ESTOQUE SECO)',1,'(Requisitos 6.4 Ambiente de Trabalho/ 7.5.3 Identificação e Rastreabilidade/ 7.5.5 Preservação do Produto/ 8.3 Controle de Produto Não Conforme)','2025-10-23 00:35:49',1,4,NULL),(20,'ARMAZENAMENTO (FREEZER / CÂMARA CONGELADOS)',1,'(Requisitos 6.4 Ambiente de Trabalho/ 7.5.3 Identificação e Rastreabilidade/ 7.5.5 Preservação do Produto/7.6 Controle de Equipamentos de Monitoramento e Medição/ 8.3 Controle de Produto Não Conforme)','2025-10-23 00:40:10',1,5,NULL),(21,'ARMAZENAMENTO (GELADEIRA/ CÂMARA REFRIGERADA)',1,'(Requisitos 6.4 Ambiente de Trabalho/ 7.5.3 Identificação e Rastreabilidade/ 7.5.5 Preservação do Produto/ 7.6 Controle de Equipamentos de Monitoramento e Medição / 8.3 Controle de Produto Não Conforme)','2025-10-23 00:44:27',1,6,NULL),(22,'EQUIPAMENTOS E UTENSÍLIOS (LIMPEZA E CONSERVAÇÃO)',1,'(Requisitos 6.3 Infraestrutura / 6.4 Ambiente de Trabalho/ 7.5.4 Propriedade do Cliente/ 7.6 Equipamentos de Monitoramento e Medição)','2025-10-23 00:48:06',1,7,NULL),(23,'LIMPEZA E ORGANIZAÇÃO - GERAL',1,'(Requisitos 6.3 Infraestrutura/ 6.4 Ambiente de Trabalho)','2025-10-23 00:51:48',1,8,NULL),(24,'PRÉ-PREPARO/PREPARO DE ALIMENTOS',1,'(Requisitos 6.4 Ambiente de Trabalho/ 7.5.1 Controle de Produção e Prestação de Serviços/ 8.2.3 Monitoramento e Medição de Processos/ 8.2.4 Monitamento e Medição de Produto/ 8.5.1 Melhoria Continua)','2025-10-23 00:56:02',1,9,NULL),(25,'DISTRIBUIÇÃO - UAN',1,'(Requisitos 6.4 Ambiente de Trabalho/ 8.2.3 Monitoramento e Medição de Processos/ 4.2.4 Controle de Registros/ 7.5. Controle de Produção e Prestação de Serviços e 7.5.3 Identificação e Rastreabilidade)','2025-10-23 00:58:14',1,10,NULL),(26,'LIXO',1,'(Requisitos 6.4 Ambiente de Trabalho/ 7.5.3 Identificação e Rastreabilidade / 7.5.1 Controle de Produção e Prestação de Serviços)','2025-10-23 00:59:27',1,11,NULL),(27,'CONTROLE DE VETORES E PRAGAS / ANÁLISE DA ÁGUA E LICENÇAS',1,'(Requisitos 6.4 Ambiente de Trabalho/ 8.2.3 Monitoramento e Medição dos Processos/ 7.1 Planejamento da Realização do Produto)','2025-10-23 02:31:32',1,12,NULL),(28,'REFEIÇÕES TRANSPORTADA - UAN',1,'(Requisitos 6.2.2 Competência, treinamento e Conscientização/ 6.3 infraestrutura/ 6.4 Ambiente de Trabalho/ 7.5.1 Controle de Produção e Prestação de Serviços 7.5.5 Preservação do Produto)','2025-10-23 02:35:21',1,13,NULL),(29,'MANIPULADORES/HÁBITOS HIGIÊNICOS',1,'(Requisitos 6.4 Ambiente de Trabalho/ 6.3 Infraestrutura/ 8.2.3 Monitoramento e Medição de Processos)','2025-10-23 02:37:32',1,14,NULL);
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
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@admin.com','000.000.000-00','2025-09-06 16:29:38','ADM','$2b$08$GSsFt2rWc4vq1rRBDYvzeuv9bRJqHZvK5JUg4FuIP0okt8KnbcMrW'),(2,'Usuario','usuario@usuario.com','222.000.000-00','2025-09-06 17:02:40','AUD','$2b$08$GSsFt2rWc4vq1rRBDYvzeuv9bRJqHZvK5JUg4FuIP0okt8KnbcMrW');
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

-- Dump completed on 2025-10-23 12:11:45
