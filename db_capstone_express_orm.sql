/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `date_created` timestamp NULL DEFAULT NULL,
  `content_info` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `img_id` int DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `img_id` (`img_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`img_id`) REFERENCES `images` (`img_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `images` (
  `img_id` int NOT NULL AUTO_INCREMENT,
  `img_name` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`img_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `save_images` (
  `user_id` int NOT NULL,
  `img_id` int NOT NULL,
  `date_save` timestamp NULL DEFAULT NULL,
  `is_saved` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`img_id`),
  KEY `img_id` (`img_id`),
  CONSTRAINT `save_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `save_images_ibfk_2` FOREIGN KEY (`img_id`) REFERENCES `images` (`img_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `pass_word` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `refresh_token` text,
  `face_app_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `comments` (`comment_id`, `date_created`, `content_info`, `user_id`, `img_id`) VALUES
(1, '2024-03-29 10:00:00', 'Comment 1', 1, 57);
INSERT INTO `comments` (`comment_id`, `date_created`, `content_info`, `user_id`, `img_id`) VALUES
(2, '2024-03-29 10:05:00', 'Comment 2', 2, 57);
INSERT INTO `comments` (`comment_id`, `date_created`, `content_info`, `user_id`, `img_id`) VALUES
(3, '2024-03-29 10:10:00', 'Comment 3', 3, 57);
INSERT INTO `comments` (`comment_id`, `date_created`, `content_info`, `user_id`, `img_id`) VALUES
(4, '2024-03-29 10:15:00', 'Comment 4', 4, 55),
(5, '2024-03-29 10:20:00', 'Comment 5', 5, 55),
(6, '2024-03-29 10:25:00', 'Comment 6', 6, 55),
(7, '2024-03-29 10:30:00', 'Comment 7', 7, 56),
(8, '2024-03-29 10:35:00', 'Comment 8', 8, 56),
(9, '2024-03-29 10:40:00', 'Comment 9', 9, 53),
(10, '2024-03-29 10:45:00', 'Comment 10', 10, 53),
(11, '2024-03-29 10:50:00', 'Comment 11', 11, 53),
(12, '2024-03-29 10:55:00', 'Comment 12', 12, 53),
(13, '2024-03-29 11:00:00', 'Comment 13', 13, 65),
(14, '2024-03-29 11:05:00', 'Comment 14', 14, 65),
(15, '2024-03-29 11:10:00', 'Comment 15', 15, 53),
(16, '2024-04-08 03:41:54', 'abc', 22, 66),
(17, '2024-04-08 03:53:43', 'abc', 22, 66),
(18, '2024-04-27 14:25:00', 'abc', 21, 66),
(19, '2024-04-27 15:03:47', 'jj', 32, 57),
(20, '2024-04-27 15:38:18', '123', 32, 64),
(21, '2024-04-28 15:00:27', 'Hello', 32, 64),
(22, '2024-04-28 16:53:31', 'L', 30, 68),
(23, '2024-05-02 05:36:09', '123', 30, 64),
(24, '2024-05-02 16:18:06', 'abc', 39, 53),
(25, '2024-05-02 16:18:16', 'abc', 39, 53),
(26, '2024-05-02 16:18:27', 'abc', 39, 53);

INSERT INTO `images` (`img_id`, `img_name`, `img_url`, `description`, `user_id`) VALUES
(53, 'cat.jpg', '1712508590650_cat.jpg', 'A gray cat lounges gracefully on a sunlit windowsill, its fur soft and sleek. Its piercing green eyes gaze into the distance with a hint of curiosity, while a contented purr emanates from its throat.', 22);
INSERT INTO `images` (`img_id`, `img_name`, `img_url`, `description`, `user_id`) VALUES
(54, 'cat.jpg', '1712508804054_cat.jpg', 'A gray cat lounges gracefully on a sunlit windowsill, its fur soft and sleek. Its piercing green eyes gaze into the distance with a hint of curiosity, while a contented purr emanates from its throat.', 22);
INSERT INTO `images` (`img_id`, `img_name`, `img_url`, `description`, `user_id`) VALUES
(55, 'cat.jpg', '1712508804055_cat.jpg', 'A gray cat lounges gracefully on a sunlit windowsill, its fur soft and sleek. Its piercing green eyes gaze into the distance with a hint of curiosity, while a contented purr emanates from its throat.', 22);
INSERT INTO `images` (`img_id`, `img_name`, `img_url`, `description`, `user_id`) VALUES
(56, 'cat.jpg', '1712509292349_cat.jpg', 'A gray cat lounges gracefully on a sunlit windowsill, its fur soft and sleek. Its piercing green eyes gaze into the distance with a hint of curiosity, while a contented purr emanates from its throat.', 22),
(57, 'cat.jpg', '1712509292350_cat.jpg', 'A gray cat lounges gracefully on a sunlit windowsill, its fur soft and sleek. Its piercing green eyes gaze into the distance with a hint of curiosity, while a contented purr emanates from its throat.', 22),
(63, 'cat2.jpg', '1713779095495_cat2.jpg', 'An orange cat lounges lazily on a sunlit windowsill, its fur aglow in the warm hues of dawn. With half-closed eyes and a contented expression, it embodies tranquility and comfort.', 22),
(64, 'cat2.jpg', '1713779121035_cat2.jpg', 'An orange cat lounges lazily on a sunlit windowsill, its fur aglow in the warm hues of dawn. With half-closed eyes and a contented expression, it embodies tranquility and comfort.', 22),
(65, 'cat2.jpg', '1713779123545_cat2.jpg', 'An orange cat lounges lazily on a sunlit windowsill, its fur aglow in the warm hues of dawn. With half-closed eyes and a contented expression, it embodies tranquility and comfort.', 22),
(66, 'cat3.jpg', '1713779256551_cat3.jpg', 'A sleek black cat lounges on a sunlit windowsill, its piercing amber eyes gleaming with curiosity. Its glossy fur reflects the light, accentuating its graceful silhouette against the backdrop of vibrant green foliage.', 22),
(67, 'cat3.jpg', '1713779256551_cat3.jpg', 'A sleek black cat lounges on a sunlit windowsill, its piercing amber eyes gleaming with curiosity. Its glossy fur reflects the light, accentuating its graceful silhouette against the backdrop of vibrant green foliage.', 22),
(68, 'cat3.jpg', '1713779273511_cat3.jpg', 'A sleek black cat lounges on a sunlit windowsill, its piercing amber eyes gleaming with curiosity. Its glossy fur reflects the light, accentuating its graceful silhouette against the backdrop of vibrant green foliage.', 22),
(69, 'cat3.jpg', '1713779290138_cat3.jpg', 'A sleek black cat lounges on a sunlit windowsill, its piercing amber eyes gleaming with curiosity. Its glossy fur reflects the light, accentuating its graceful silhouette against the backdrop of vibrant green foliage.', 22),
(70, 'cat3.jpg', '1714378954519_cat3.jpg', '22212', 22),
(74, 'cat3.jpg', '1714381276848_cat3.jpg', '22212', 30),
(78, 'cat3.jpg', '1714443795805_cat3.jpg', '22212', 30),
(98, 'cat.jpg', '1714447654990_cat.jpg', '40670', 30),
(99, 'cat3.jpg', '1714447654991_cat3.jpg', '22212', 30),
(100, 'cat.jpg', '1714447841549_cat.jpg', '40670', 30),
(101, 'cat3.jpg', '1714447841550_cat3.jpg', '22212', 30),
(106, 'cat.jpg', '1714451334010_cat.jpg', '40670', 30),
(107, 'cat3.jpg', '1714451334011_cat3.jpg', '22212', 30),
(110, 'cat2.jpg', '1714539649626_cat2.jpg', '131296', 30);

INSERT INTO `save_images` (`user_id`, `img_id`, `date_save`, `is_saved`) VALUES
(1, 63, '2024-04-27 16:48:11', 1);
INSERT INTO `save_images` (`user_id`, `img_id`, `date_save`, `is_saved`) VALUES
(22, 53, '2024-04-28 16:27:19', 1);
INSERT INTO `save_images` (`user_id`, `img_id`, `date_save`, `is_saved`) VALUES
(22, 54, '2024-04-27 17:09:06', 1);
INSERT INTO `save_images` (`user_id`, `img_id`, `date_save`, `is_saved`) VALUES
(22, 55, '2024-04-27 17:25:36', 1),
(22, 57, '2024-04-28 15:44:14', 1),
(22, 63, '2024-04-27 16:34:30', 1),
(22, 64, '2024-04-27 17:01:02', 1),
(30, 56, '2024-05-02 09:57:35', 1),
(30, 63, '2024-05-12 11:11:10', 1),
(30, 68, '2024-04-28 17:00:26', 1),
(39, 53, '2024-05-02 16:18:57', 1);

INSERT INTO `users` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`, `role`, `refresh_token`, `face_app_id`) VALUES
(1, 'user1@example.com', 'password1', 'User One', 25, 'avatar1.jpg', 'user', NULL, NULL);
INSERT INTO `users` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`, `role`, `refresh_token`, `face_app_id`) VALUES
(2, 'user2@example.com', 'password2', 'User Two', 30, 'avatar2.jpg', 'user', NULL, NULL);
INSERT INTO `users` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`, `role`, `refresh_token`, `face_app_id`) VALUES
(3, 'user3@example.com', 'password3', 'User Three', 35, 'avatar3.jpg', 'user', NULL, NULL);
INSERT INTO `users` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`, `role`, `refresh_token`, `face_app_id`) VALUES
(4, 'user4@example.com', 'password4', 'User Four', 40, 'avatar4.jpg', 'admin', NULL, NULL),
(5, 'user5@example.com', 'password5', 'User Five', 45, 'avatar5.jpg', 'user', NULL, NULL),
(6, 'user6@example.com', 'password6', 'User Six', 50, 'avatar6.jpg', 'user', NULL, NULL),
(7, 'user7@example.com', 'password7', 'User Seven', 55, 'avatar7.jpg', 'admin', NULL, NULL),
(8, 'user8@example.com', 'password8', 'User Eight', 60, 'avatar8.jpg', 'user', NULL, NULL),
(9, 'user9@example.com', 'password9', 'User Nine', 65, 'avatar9.jpg', 'user', NULL, NULL),
(10, 'user10@example.com', 'password10', 'User Ten', 70, 'avatar10.jpg', 'user', NULL, NULL),
(11, 'user11@example.com', 'password11', 'User Eleven', 75, 'avatar11.jpg', 'user', NULL, NULL),
(12, 'user12@example.com', 'password12', 'User Twelve', 80, 'avatar12.jpg', 'admin', NULL, NULL),
(13, 'user13@example.com', 'password13', 'User Thirteen', 85, 'avatar13.jpg', 'user', NULL, NULL),
(14, 'user14@example.com', 'password14', 'User Fourteen', 90, 'avatar14.jpg', 'user', NULL, NULL),
(15, 'user15@example.com', 'password15', 'User Fifteen', 95, 'avatar15.jpg', 'user', NULL, NULL),
(16, 'test1@gmail.com', '123', 'abc', 18, NULL, 'user', NULL, NULL),
(17, 'test2@gmail.com', '123', 'abc', 18, NULL, 'user', NULL, NULL),
(18, 'test2@mail.com', '123', 'abc', 18, NULL, 'user', NULL, NULL),
(19, 'user11@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'test3@gmail.com', '123', 'abc', 18, NULL, 'user', NULL, NULL),
(21, 'test4@gmail.com', '$2b$10$BAIEnm9iTl1yMyAOIb5VzO8dDjW5.4L4UX1.AGL.dgadvPfJ7RJLu', 'abc', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIxLCJpYXQiOjE3MTQzMjI4NTUsImV4cCI6MTc0NTg4MDQ1NX0.GFtmtfctorUtATLXjOrexRdrAZjbBuj8vVl6-w--PSg', NULL),
(22, 'test5@gmail.com', '$2b$10$uCv7pFP5StHf4c55r5ldgOYbuBK0/5ZmQl.7C73xDpBEenJ.Gja3m', 'abc', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJpYXQiOjE3MTQzMTk0NzAsImV4cCI6MTc0NTg3NzA3MH0.CL2yAs8umP-kHJlH5BUDKgz-zKtegQ8de81jMna56JY', NULL),
(30, 'test6@gmail.com', '$2b$10$Yv4tWyzAa8PnWbMUSgzfAe0pnL4a82UzFHztGHMJ.JLrvSNc3Masi', 'abcde', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJpYXQiOjE3MTU1MTA5MjksImV4cCI6MTc0NzA2ODUyOX0.pzCSI3zCfLDN2TX1EtLGCUjlQUidIF2H6Y2M3M3VZ9U', NULL),
(31, 'test7@gmail.com', '$2b$10$T.jiAytLb1.Tr59PHPtWXe91I3cHLlnr0QBcUJZMg7n1szW2x1zPS', 'abcd', 19, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxLCJpYXQiOjE3MTQ2NDQ5MzcsImV4cCI6MTc0NjIwMjUzN30.kpj_Po4WGtrpqdKnh2m9GftEcnVQTdm9nXbbixdpIQM', NULL),
(32, 'test8@gmail.com', '$2b$10$bWEvr6sxDO4U1gOS/32XPeHjbxnRWX3VS/wcMRPqZuW8ewzmA/YN.', 'abcd', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyLCJpYXQiOjE3MTQ1Nzc5NzUsImV4cCI6MTc0NjEzNTU3NX0.ZUB0Ij9HgX0N6dDhMqXqx1AUrc7xdOIbqHIvjGHs5YI', NULL),
(34, 'test10@gmail.com', '$2b$10$.MOqe2a5MhHg2edqv057yudvemnIKESmbwkEPHvaXmvkEVBiNMMqW', 'abcdef', 12, NULL, 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM0LCJpYXQiOjE3MTU1MTA3NzIsImV4cCI6MTc0NzA2ODM3Mn0.B8MyQvw2Kg-uMQFJF8exIeiZM4cPtKMWRNpFIxqXg44', NULL),
(35, 'test9@gmail.com', '$2b$10$ecwPZESUvLrgM4r/AjI5Q.nDNn.VzZ5fQDPOeYCp79suYE6qcHP0e', 'abcd', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM1LCJpYXQiOjE3MTQ2MjQ4NTcsImV4cCI6MTc0NjE4MjQ1N30.z0Qd_mUtXB1U8AEMENmOSUrcOPo4U9jaAnkREoWO7oM', NULL),
(36, 'test11@gmail.com', '$2b$10$2l.ut5Chgk1Y5/cTg.Np4.K3xcT9qpbY4Zhh/2cPE6SnpeeimsjRm', 'abcd', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM2LCJpYXQiOjE3MTQ2MjQ4MzAsImV4cCI6MTc0NjE4MjQzMH0.kt_x5Nz4u-rnRTL2jFfw5kHSEvv-YprWOT-XzTtO9VU', NULL),
(37, 'test12@gmail.com', '$2b$10$9Aa9E9JI/rDNMj1QDKIKjuOZubNjlGyDJznC0Ox7oZ65f7IPtLdOq', 'abcd', 18, NULL, 'user', NULL, NULL),
(38, 'test13@gmail.com', '$2b$10$4fBn0ampw0Vhd2C2yhH.vuzgRnHzGmW..fr1H448t/DDSr9A.cSj6', 'abcdef', 20, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM4LCJpYXQiOjE3MTQ2NjYwOTQsImV4cCI6MTc0NjIyMzY5NH0.9IyRE0189zKBmnLyZRUZvvSJCaxctMAAm36S6uG_bJ4', NULL),
(39, 'test14@gmail.com', '$2b$10$0oRV8dkdTyofzu.gGdf3r.bg17Q5kYfRrt3IZgEvg4VGZk.A0EhOC', 'abcd', 18, NULL, 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJpYXQiOjE3MTQ2NjY1MTYsImV4cCI6MTc0NjIyNDExNn0.-OQEYP-fDRC0aUl30vZjPdfqvnbqXXrAuKzNOSVGqH4', NULL);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;