-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: fixedhack
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

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
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_event` (`user_id`,`event_id`),
  KEY `idx_event` (`event_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
INSERT INTO `event_registrations` VALUES (3,6,7,'2025-12-05 08:18:43'),(5,7,7,'2025-12-08 07:17:19'),(6,8,7,'2025-12-09 04:04:00');
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_views`
--

DROP TABLE IF EXISTS `event_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `event_views_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_views_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_views`
--

LOCK TABLES `event_views` WRITE;
/*!40000 ALTER TABLE `event_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description_full` text,
  `description_short` varchar(500) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `type` enum('hackathon','webinar','internship') NOT NULL,
  `apply_link` varchar(500) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `location` varchar(255) DEFAULT 'Online',
  `duration` varchar(255) DEFAULT 'N/A',
  `prize` varchar(255) DEFAULT 'N/A',
  `participants` varchar(255) DEFAULT 'N/A',
  `views` int DEFAULT '0',
  `registrations` int DEFAULT '0',
  `date_text` varchar(255) DEFAULT NULL,
  `status` enum('upcoming','ongoing','registration-open','closed') DEFAULT 'upcoming',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (7,'Smart India Hackathon','Smart India Hackathon for smart kids','Smart India Hackathon for smart kids',NULL,NULL,'hackathon','https://www.google.com/url?sa=i&source=web&rct=j&url=https://www.sih.gov.in/&ved=2ahUKEwjE1-KB4IeRAxUNbmwGHSxPG74Qy_kOegQIAxAB&opi=89978449&cd&psig=AOvVaw1CL-pupHJ34zLrBRr7aTVr&ust=1763969342639000','jafeha6258@izeao.com','General',3,'2025-11-23 07:34:44',NULL,'India Expo Mart, Gautam Buddh Nagar, Greater Noida','00:12 - 16:44','Free','N/A',0,11,'2025-11-23 to 2025-12-03','upcoming');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `opportunity_id` int DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `event_id` int DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `read_flag` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,4,'sent',NULL,NULL,0,'2025-11-09 19:39:04');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('user','admin','student','host') DEFAULT 'student',
  `preferences` json DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `education` varchar(255) DEFAULT NULL,
  `interests` text,
  `organization` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@example.com','','$2b$10$TObCB72Y1Ywh6vBPO9Gpium1PPC4g9NcWJ4xFDpYl.wBlhEW9M/cK','admin',NULL,1,'2025-11-09 07:11:28',NULL,NULL,NULL),(2,'John Doe','john@example.com','$2b$10$1c2MspvHmxAa9BjCkdSG2ejTOlxt/GlkwkPMKiZZWKfX1Pyn7u51S',NULL,'student',NULL,1,'2025-11-12 11:42:02','B.Tech','AI,ML',NULL),(3,'FixedHack','jafeha6258@izeao.com','$2b$10$OAsttBBa.XfoRUeOgz0AWetc0yA4.UvN3T3RgpFAx/k6JOYJgcUJq',NULL,'host',NULL,1,'2025-11-22 08:01:31',NULL,NULL,'FixedHack'),(4,'Smart Kid','guxm0@comfythings.com','$2b$10$n4wj0qM7xy0KLFmb7qOmo.VmOMS5vZCwKdr0WZqZLqXBfqgOLgQva',NULL,'student',NULL,1,'2025-11-23 08:51:16','undergraduate','all',NULL),(5,'John Doe','s7w3w@comfythings.com','$2b$10$g4L01oAr8OL5919Lsl4ToOw8RcDUPWmmILag5ps7d5GOopWf0ZA0C',NULL,'student',NULL,1,'2025-11-26 10:32:09','undergraduate','hackathons',NULL),(6,'Hii bye','a4m7y@comfythings.com','$2b$10$3rGkbBJaAmSNcaEhIQ2HFuQE.7.EwNHvrTwn3MfnkYJiFtR6H7R3K',NULL,'student',NULL,1,'2025-12-05 08:17:41','undergraduate','hackathons',NULL),(7,'adad aeae','7vyco@comfythings.com','$2b$10$u312zu9xh2q/nTOTdihrQe9.7zgcQZjz1FWglunVyPiJElECX8uUi',NULL,'student',NULL,1,'2025-12-08 06:19:14','professional','workshops',NULL),(8,'John Doe','883g2@comfythings.com','$2b$10$yEdQeGJmKRT/2WSfhSDJx.xouQKQ71XbHxaPAnGbKXvD3Mr5qRfHi',NULL,'student',NULL,1,'2025-12-09 04:03:35','graduate','internships',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 17:23:51
