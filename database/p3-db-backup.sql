-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: bakichu77.mysql.pythonanywhere-services.com    Database: bakichu77$wallpapers
-- ------------------------------------------------------
-- Server version	5.6.48-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `market_externaltransfer`
--

DROP TABLE IF EXISTS `market_externaltransfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_externaltransfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deposit` tinyint(1) NOT NULL,
  `quantity` decimal(19,2) DEFAULT NULL,
  `date` datetime(6) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `market_externaltransfer_user_id_ca4bc959_fk_market_user_id` (`user_id`),
  CONSTRAINT `market_externaltransfer_user_id_ca4bc959_fk_market_user_id` FOREIGN KEY (`user_id`) REFERENCES `market_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_externaltransfer`
--

LOCK TABLES `market_externaltransfer` WRITE;
/*!40000 ALTER TABLE `market_externaltransfer` DISABLE KEYS */;
INSERT INTO `market_externaltransfer` VALUES (1,1,50.00,'2021-04-13 20:23:28.561973',6),(2,0,5.00,'2021-04-13 20:23:43.295830',6),(3,1,500.00,'2021-04-14 00:00:24.842096',6),(4,1,50000.00,'2021-04-14 00:00:35.949924',6),(5,0,500.00,'2021-04-14 00:00:47.739333',6),(6,1,50000.00,'2021-04-14 19:53:40.510571',6),(7,0,2500.00,'2021-04-14 19:53:58.381533',6),(8,1,500.00,'2021-04-19 20:29:53.037185',7),(9,1,50000.00,'2021-04-25 21:29:47.256366',16),(10,1,500000.00,'2021-04-25 21:30:14.024950',16),(11,0,500.00,'2021-04-25 21:30:28.438388',16),(12,0,20000.00,'2021-04-25 21:40:29.246037',20);
/*!40000 ALTER TABLE `market_externaltransfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_stock`
--

DROP TABLE IF EXISTS `market_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticker` varchar(5) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `market_price` decimal(19,2) DEFAULT NULL,
  `ipo_price` decimal(19,2) NOT NULL,
  `shares_outstanding` decimal(19,2) NOT NULL,
  `industry` varchar(30) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `market_stock_owner_id_5bbb5e58_fk_market_user_id` (`owner_id`),
  CONSTRAINT `market_stock_owner_id_5bbb5e58_fk_market_user_id` FOREIGN KEY (`owner_id`) REFERENCES `market_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_stock`
--

LOCK TABLES `market_stock` WRITE;
/*!40000 ALTER TABLE `market_stock` DISABLE KEYS */;
INSERT INTO `market_stock` VALUES (7,'TSLA','Tesla',500.00,500.00,1000000.00,'energy',15),(8,'ARKX','ARK Space Exploration',NULL,20.00,1000000.00,'tech',16),(9,'AAPL','Apple',NULL,130.00,1000000.00,'tech',18),(11,'AMZN','Amazon',2500.00,3000.00,1000000.00,'tech',20);
/*!40000 ALTER TABLE `market_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_stockbalance`
--

DROP TABLE IF EXISTS `market_stockbalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_stockbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` decimal(19,2) NOT NULL,
  `available_quantity` decimal(19,2) NOT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `market_stockbalance_stock_id_4efde6fb_fk_market_stock_id` (`stock_id`),
  KEY `market_stockbalance_user_id_48a186af_fk_market_user_id` (`user_id`),
  CONSTRAINT `market_stockbalance_stock_id_4efde6fb_fk_market_stock_id` FOREIGN KEY (`stock_id`) REFERENCES `market_stock` (`id`),
  CONSTRAINT `market_stockbalance_user_id_48a186af_fk_market_user_id` FOREIGN KEY (`user_id`) REFERENCES `market_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_stockbalance`
--

LOCK TABLES `market_stockbalance` WRITE;
/*!40000 ALTER TABLE `market_stockbalance` DISABLE KEYS */;
INSERT INTO `market_stockbalance` VALUES (53,150.00,150.00,7,6),(54,0.00,0.00,7,7),(55,0.00,0.00,7,8),(58,0.00,0.00,7,13),(59,0.00,0.00,7,14),(60,999850.00,999850.00,7,15),(61,0.00,0.00,7,16),(62,0.00,0.00,7,17),(63,0.00,0.00,7,18),(64,0.00,0.00,8,6),(65,0.00,0.00,8,7),(66,0.00,0.00,8,8),(69,0.00,0.00,8,13),(70,0.00,0.00,8,14),(71,0.00,0.00,8,15),(72,1000000.00,999900.00,8,16),(73,0.00,0.00,8,17),(74,0.00,0.00,8,18),(75,0.00,0.00,9,6),(76,0.00,0.00,9,7),(77,0.00,0.00,9,8),(80,0.00,0.00,9,13),(81,0.00,0.00,9,14),(82,0.00,0.00,9,15),(83,0.00,0.00,9,16),(84,0.00,0.00,9,17),(85,1000000.00,1000000.00,9,18),(101,0.00,0.00,7,20),(102,0.00,0.00,8,20),(103,0.00,0.00,9,20),(105,0.00,0.00,11,6),(106,0.00,0.00,11,7),(107,0.00,0.00,11,8),(110,0.00,0.00,11,13),(111,0.00,0.00,11,14),(112,0.00,0.00,11,15),(113,5700.00,5700.00,11,16),(114,0.00,0.00,11,17),(115,0.00,0.00,11,18),(117,994300.00,994100.00,11,20);
/*!40000 ALTER TABLE `market_stockbalance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_transaction`
--

DROP TABLE IF EXISTS `market_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` decimal(19,2) NOT NULL,
  `price` decimal(19,2) NOT NULL,
  `bid` tinyint(1) NOT NULL,
  `date_submitted` datetime(6) NOT NULL,
  `date_completed` datetime(6) DEFAULT NULL,
  `from_user_id` int(11) DEFAULT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `to_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `market_transaction_from_user_id_3a85e950_fk_market_user_id` (`from_user_id`),
  KEY `market_transaction_to_user_id_51618f76_fk_market_user_id` (`to_user_id`),
  KEY `market_transaction_stock_id_bf75648d_fk_market_stock_id` (`stock_id`),
  CONSTRAINT `market_transaction_from_user_id_3a85e950_fk_market_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `market_user` (`id`),
  CONSTRAINT `market_transaction_stock_id_bf75648d_fk_market_stock_id` FOREIGN KEY (`stock_id`) REFERENCES `market_stock` (`id`),
  CONSTRAINT `market_transaction_to_user_id_51618f76_fk_market_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `market_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_transaction`
--

LOCK TABLES `market_transaction` WRITE;
/*!40000 ALTER TABLE `market_transaction` DISABLE KEYS */;
INSERT INTO `market_transaction` VALUES (6,100.00,500.00,0,'2021-04-13 23:57:25.189769',NULL,15,7,6),(7,50.00,500.00,0,'2021-04-14 00:19:33.173725',NULL,15,7,6),(9,100.00,30.00,0,'2021-04-19 20:29:00.431742',NULL,16,8,NULL),(10,50.00,20.00,1,'2021-04-19 20:29:15.298449',NULL,6,8,NULL),(11,5000.00,3100.00,0,'2021-04-25 21:28:16.720170',NULL,20,11,16),(12,100.00,3200.00,0,'2021-04-25 21:28:29.413388',NULL,20,11,16),(13,200.00,3300.00,0,'2021-04-25 21:31:12.594518',NULL,20,11,16),(14,200.00,3250.00,0,'2021-04-25 21:39:22.173901',NULL,20,11,16),(15,100.00,2500.00,1,'2021-04-25 21:39:34.959773',NULL,16,11,NULL),(16,200.00,2500.00,0,'2021-04-25 21:40:02.729025',NULL,20,11,16),(18,200.00,3550.00,0,'2021-04-25 21:41:46.635343',NULL,20,11,NULL);
/*!40000 ALTER TABLE `market_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_user`
--

DROP TABLE IF EXISTS `market_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(254) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `date_of_birth` date NOT NULL,
  `buying_power` decimal(19,2) NOT NULL,
  `cash` decimal(19,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_user`
--

LOCK TABLES `market_user` WRITE;
/*!40000 ALTER TABLE `market_user` DISABLE KEYS */;
INSERT INTO `market_user` VALUES (6,'Bas','Abdelbaki','vasd@gmail.com','gad','42134','1232-12-12',19295.00,20045.00),(7,'1222','Abdelbaki','basselabdelbaki@gmail.co','dopu','12345','2222-12-12',500.00,500.00),(8,'bdaf','1231','abdelbaki.b@gmail.com','23123','2312312','1111-12-21',0.00,0.00),(13,'sad','sfdsa','basselabdelbaki@gmail.com','asfdsad','23r','3222-12-21',0.00,0.00),(14,'njkasdf','bjhskadf','basselabdelbaki@gmail.com','beep','njksa','2111-10-21',0.00,0.00),(15,'Elon','Musk','elonmusk@gmail.com','emusk','elon','1970-01-11',77500.00,77500.00),(16,'Cathie','Wood','cwood@ark.com','cwood','cwood','1950-10-20',-17330500.00,-17080500.00),(17,'basd','fasdf','bassel@modernmediamerch.com','basdf','basf','2111-08-21',0.00,0.00),(18,'Tim','Cook','tcook@apple.com','tcook','tcook','1211-12-12',0.00,0.00),(20,'Jeff','Bezos','jbezos@amazon.com','jebzos','jebzos','1920-01-21',17610000.00,17610000.00);
/*!40000 ALTER TABLE `market_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-26 20:58:38
