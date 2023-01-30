DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `name` varchar(128) NOT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `users_UN` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `mails`;
CREATE TABLE `mails` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `subject` varchar(100) NOT NULL,
                         `body` text NOT NULL,
                         `user_from_id` int NOT NULL,
                         `user_to_id` int NOT NULL,
                         `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `is_read` tinyint NOT NULL DEFAULT '0',
                         PRIMARY KEY (`id`),
                         KEY `mails_user_fromFK` (`user_from_id`),
                         KEY `mails_user_toFK` (`user_to_id`),
                         CONSTRAINT `mails_user_fromFK` FOREIGN KEY (`user_from_id`) REFERENCES `users` (`id`),
                         CONSTRAINT `mails_user_toFK` FOREIGN KEY (`user_to_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;