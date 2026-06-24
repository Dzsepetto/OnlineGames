-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20260225.3766910a80
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 24, 2026 at 11:54 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dzsepetto_local_quiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer_option`
--

CREATE TABLE `answer_option` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `label` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `order_index` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `answer_option`
--

INSERT INTO `answer_option` (`id`, `question_id`, `label`, `is_correct`, `order_index`) VALUES
('cbff9d50-38d2-11f1-a31c-1062e5f4582d', 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'nem', 0, 1),
('cbffc03f-38d2-11f1-a31c-1062e5f4582d', 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'igen', 1, 2),
('cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'Nagy', 1, 1),
('cc00254b-38d2-11f1-a31c-1062e5f4582d', 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'Kovács', 0, 2),
('cc00452d-38d2-11f1-a31c-1062e5f4582d', 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'Ticsi', 0, 3),
('cc0062b3-38d2-11f1-a31c-1062e5f4582d', 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'Szagedi', 0, 4);

-- --------------------------------------------------------

--
-- Table structure for table `game_answers`
--

CREATE TABLE `game_answers` (
  `id` int NOT NULL,
  `game_id` varchar(6) DEFAULT NULL,
  `player_id` int DEFAULT NULL,
  `question_id` char(36) DEFAULT NULL,
  `answer_id` char(36) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `answered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `started_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `game_answers`
--

INSERT INTO `game_answers` (`id`, `game_id`, `player_id`, `question_id`, `answer_id`, `is_correct`, `answered_at`, `started_at`) VALUES
(1, '369045', 15, 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'cbffc03f-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:21:57', NULL),
(2, '369045', 15, 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:22:04', NULL),
(3, '946637', 16, 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'cbffc03f-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:28:54', NULL),
(4, '946637', 16, 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:29:06', NULL),
(5, '688562', 17, 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'cbffc03f-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:30:38', NULL),
(6, '688562', 17, 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:31:48', NULL),
(7, '270023', 18, 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'cbffc03f-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:37:20', NULL),
(8, '270023', 18, 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:37:29', NULL),
(9, '220292', 19, 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'cbffc03f-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:38:49', NULL),
(10, '220292', 19, 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 10:38:56', NULL),
(11, '640190', 20, 'cbff476e-38d2-11f1-a31c-1062e5f4582d', 'cbffc03f-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 12:29:19', '2026-04-16 12:29:16'),
(12, '640190', 20, 'cbffde57-38d2-11f1-a31c-1062e5f4582d', 'cbfffbcc-38d2-11f1-a31c-1062e5f4582d', 1, '2026-04-16 12:29:25', '2026-04-16 12:29:22');

-- --------------------------------------------------------

--
-- Table structure for table `game_players`
--

CREATE TABLE `game_players` (
  `id` int NOT NULL,
  `game_id` varchar(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `score` int DEFAULT '0',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `game_players`
--

INSERT INTO `game_players` (`id`, `game_id`, `name`, `score`, `joined_at`) VALUES
(1, NULL, NULL, 0, '2026-04-13 15:36:22'),
(2, NULL, NULL, 0, '2026-04-13 15:36:41'),
(3, '992638', 'jumurdzsák', 0, '2026-04-13 15:39:26'),
(4, '655862', 'jum', 0, '2026-04-13 16:05:33'),
(5, '146213', 'jum', 0, '2026-04-14 11:43:54'),
(6, '880439', 'jum', 0, '2026-04-14 11:51:34'),
(7, '104118', 'jum', 0, '2026-04-14 12:31:52'),
(8, '612997', 'JUM', 0, '2026-04-14 12:51:04'),
(9, '551356', 'jum', 0, '2026-04-14 20:49:22'),
(10, '771595', 'jum', 0, '2026-04-15 15:58:50'),
(11, '355978', 'jum', 0, '2026-04-15 16:47:17'),
(12, '644443', 'jum', 0, '2026-04-15 17:16:13'),
(13, '419030', 'jum', 0, '2026-04-15 17:41:31'),
(14, '721603', 'jum', 0, '2026-04-15 17:53:56'),
(15, '369045', 'Benedek', 0, '2026-04-16 10:16:00'),
(16, '946637', 'Benedek', 0, '2026-04-16 10:28:48'),
(17, '688562', 'jum', 0, '2026-04-16 10:30:31'),
(18, '270023', 'Benedek', 0, '2026-04-16 10:37:09'),
(19, '220292', 'sdkj', 0, '2026-04-16 10:38:39'),
(20, '640190', 'Benedek', 0, '2026-04-16 12:29:11');

-- --------------------------------------------------------

--
-- Table structure for table `game_sessions`
--

CREATE TABLE `game_sessions` (
  `id` varchar(6) NOT NULL,
  `quiz_id` char(36) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `current_question_index` int DEFAULT '0',
  `question_started_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `game_sessions`
--

INSERT INTO `game_sessions` (`id`, `quiz_id`, `state`, `current_question_index`, `question_started_at`, `created_at`) VALUES
('104118', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'playing', 0, '2026-04-14 12:31:59', '2026-04-14 12:31:38'),
('144765', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-15 17:04:37'),
('146213', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'question', 0, '2026-04-14 11:46:31', '2026-04-14 11:43:46'),
('220292', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-16 10:38:52', '2026-04-16 10:38:30'),
('225745', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-13 15:32:58'),
('264389', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-13 15:39:10'),
('270023', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-16 10:37:25', '2026-04-16 10:36:53'),
('325065', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-15 17:29:22', '2026-04-15 17:26:49'),
('341358', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-15 17:53:38', '2026-04-15 17:42:14'),
('355978', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-15 16:47:29', '2026-04-15 16:47:10'),
('369045', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-16 10:22:00', '2026-04-16 10:15:53'),
('419030', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-15 17:41:47', '2026-04-15 17:35:30'),
('549790', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'playing', 1, '2026-04-15 17:35:23', '2026-04-15 17:34:08'),
('551356', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 0, '2026-04-14 20:49:27', '2026-04-14 20:49:15'),
('554655', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-15 17:11:25'),
('612997', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 0, '2026-04-14 12:51:08', '2026-04-14 12:50:43'),
('640190', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-16 12:29:22', '2026-04-16 12:28:56'),
('644443', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'playing', 0, '2026-04-15 17:16:25', '2026-04-15 17:15:56'),
('649278', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-14 11:53:38'),
('655862', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-13 16:05:27'),
('688562', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-16 10:31:28', '2026-04-16 10:30:16'),
('721603', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-15 17:54:07', '2026-04-15 17:53:45'),
('771595', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-15 15:59:22', '2026-04-15 15:58:41'),
('801404', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-16 12:32:41'),
('802568', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-13 15:36:09'),
('880439', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'playing', 0, '2026-04-14 11:53:32', '2026-04-14 11:51:19'),
('946637', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'finished', 1, '2026-04-16 10:29:00', '2026-04-16 10:28:34'),
('992638', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'lobby', 0, NULL, '2026-04-13 15:39:13');

-- --------------------------------------------------------

--
-- Table structure for table `matching_left_item`
--

CREATE TABLE `matching_left_item` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `text` text NOT NULL,
  `order_index` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matching_pair`
--

CREATE TABLE `matching_pair` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `left_id` char(36) NOT NULL,
  `right_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matching_right_item`
--

CREATE TABLE `matching_right_item` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `text` text NOT NULL,
  `order_index` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id` char(36) NOT NULL,
  `quiz_id` char(36) NOT NULL,
  `type` varchar(20) NOT NULL,
  `question_text` text NOT NULL,
  `order_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `quiz_id`, `type`, `question_text`, `order_index`, `created_at`) VALUES
('cbff476e-38d2-11f1-a31c-1062e5f4582d', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'MULTIPLE_CHOICE', 'igen?', 1, '2026-04-15 13:55:44'),
('cbffde57-38d2-11f1-a31c-1062e5f4582d', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'MULTIPLE_CHOICE', 'Alekosz vezetékneve?', 2, '2026-04-15 13:55:44');

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` char(36) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `difficulty` smallint DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `language_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`id`, `slug`, `title`, `description`, `difficulty`, `is_published`, `created_at`, `updated_at`, `created_by`, `is_public`, `language_code`) VALUES
('f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 'test-e5d679', 'test', 'valami', NULL, 1, '2026-03-09 16:35:24', '2026-03-09 16:35:24', 1, 1, 'hu');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempt`
--

CREATE TABLE `quiz_attempt` (
  `id` char(36) NOT NULL,
  `quiz_id` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  `max_score` int NOT NULL,
  `duration_sec` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quiz_attempt`
--

INSERT INTO `quiz_attempt` (`id`, `quiz_id`, `user_id`, `score`, `max_score`, `duration_sec`, `created_at`) VALUES
('fea3a15d-1bd5-11f1-8d35-1062e5f4582d', 'f8f1154b-1bd5-11f1-8d35-1062e5f4582d', 1, 2, 1, NULL, '2026-03-09 17:35:33');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_viewer_email`
--

CREATE TABLE `quiz_viewer_email` (
  `quiz_id` char(36) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `nickname` varchar(80) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `nickname`, `description`, `created_at`) VALUES
(1, 'pinterbence2002@gmail.com', 'pintér benedek', 'Dzsepetto', 'Ez a legmenőbb quiz creator profil', '2026-03-09 16:35:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer_option`
--
ALTER TABLE `answer_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ANSWER_QUESTION` (`question_id`);

--
-- Indexes for table `game_answers`
--
ALTER TABLE `game_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `answer_id` (`answer_id`);

--
-- Indexes for table `game_players`
--
ALTER TABLE `game_players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indexes for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `matching_left_item`
--
ALTER TABLE `matching_left_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_MATCH_LEFT_QUESTION` (`question_id`);

--
-- Indexes for table `matching_pair`
--
ALTER TABLE `matching_pair`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_MATCH_PAIR_QUESTION` (`question_id`),
  ADD KEY `FK_PAIR_LEFT` (`left_id`),
  ADD KEY `FK_PAIR_RIGHT` (`right_id`);

--
-- Indexes for table `matching_right_item`
--
ALTER TABLE `matching_right_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_MATCH_RIGHT_QUESTION` (`question_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_QUESTION_QUIZ` (`quiz_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_QUIZ_USER` (`created_by`);

--
-- Indexes for table `quiz_attempt`
--
ALTER TABLE `quiz_attempt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_quiz` (`user_id`,`quiz_id`),
  ADD KEY `IDX_ATTEMPT_QUIZ` (`quiz_id`);

--
-- Indexes for table `quiz_viewer_email`
--
ALTER TABLE `quiz_viewer_email`
  ADD KEY `IDX_VIEWER_QUIZ` (`quiz_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game_answers`
--
ALTER TABLE `game_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `game_players`
--
ALTER TABLE `game_players`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer_option`
--
ALTER TABLE `answer_option`
  ADD CONSTRAINT `FK_ANSWER_OPTION_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `game_answers`
--
ALTER TABLE `game_answers`
  ADD CONSTRAINT `game_answers_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `game_sessions` (`id`),
  ADD CONSTRAINT `game_answers_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `game_players` (`id`),
  ADD CONSTRAINT `game_answers_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  ADD CONSTRAINT `game_answers_ibfk_4` FOREIGN KEY (`answer_id`) REFERENCES `answer_option` (`id`);

--
-- Constraints for table `game_players`
--
ALTER TABLE `game_players`
  ADD CONSTRAINT `game_players_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `game_sessions` (`id`);

--
-- Constraints for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD CONSTRAINT `game_sessions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`);

--
-- Constraints for table `matching_left_item`
--
ALTER TABLE `matching_left_item`
  ADD CONSTRAINT `FK_LEFT_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `matching_pair`
--
ALTER TABLE `matching_pair`
  ADD CONSTRAINT `FK_PAIR_LEFT` FOREIGN KEY (`left_id`) REFERENCES `matching_left_item` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PAIR_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PAIR_RIGHT` FOREIGN KEY (`right_id`) REFERENCES `matching_right_item` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `matching_right_item`
--
ALTER TABLE `matching_right_item`
  ADD CONSTRAINT `FK_RIGHT_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `FK_QUESTION_QUIZ` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `FK_QUIZ_USER` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `quiz_attempt`
--
ALTER TABLE `quiz_attempt`
  ADD CONSTRAINT `FK_QA_QUIZ` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_QA_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_viewer_email`
--
ALTER TABLE `quiz_viewer_email`
  ADD CONSTRAINT `FK_VIEWER_QUIZ` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
