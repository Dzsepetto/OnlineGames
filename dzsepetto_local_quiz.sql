-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Gép: localhost
-- Létrehozás ideje: 2026. Már 09. 17:09
-- Kiszolgáló verziója: 11.8.3-MariaDB-deb12
-- PHP verzió: 7.1.33-68+0~20250707.110+debian12~1.gbp5b05bb

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `dzsepetto_online_quiz`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `answer_option`
--

CREATE TABLE IF NOT EXISTS `answer_option` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `label` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `order_index` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `matching_left_item`
--

CREATE TABLE IF NOT EXISTS `matching_left_item` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `text` text NOT NULL,
  `order_index` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `matching_pair`
--

CREATE TABLE IF NOT EXISTS `matching_pair` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `left_id` char(36) NOT NULL,
  `right_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `matching_right_item`
--

CREATE TABLE IF NOT EXISTS `matching_right_item` (
  `id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `text` text NOT NULL,
  `order_index` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `question`
--

CREATE TABLE IF NOT EXISTS `question` (
  `id` char(36) NOT NULL,
  `quiz_id` char(36) NOT NULL,
  `type` varchar(20) NOT NULL,
  `question_text` text NOT NULL,
  `order_index` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `quiz`
--

CREATE TABLE IF NOT EXISTS `quiz` (
  `id` char(36) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty` smallint(6) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `language_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `quiz_attempt`
--

CREATE TABLE IF NOT EXISTS `quiz_attempt` (
  `id` char(36) NOT NULL,
  `quiz_id` char(36) NOT NULL,
  `user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `max_score` int(11) NOT NULL,
  `duration_sec` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `quiz_viewer_email`
--

CREATE TABLE IF NOT EXISTS `quiz_viewer_email` (
  `quiz_id` char(36) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `answer_option`
--
ALTER TABLE `answer_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ANSWER_QUESTION` (`question_id`);

--
-- A tábla indexei `matching_left_item`
--
ALTER TABLE `matching_left_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_MATCH_LEFT_QUESTION` (`question_id`);

--
-- A tábla indexei `matching_pair`
--
ALTER TABLE `matching_pair`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_MATCH_PAIR_QUESTION` (`question_id`),
  ADD KEY `FK_PAIR_LEFT` (`left_id`),
  ADD KEY `FK_PAIR_RIGHT` (`right_id`);

--
-- A tábla indexei `matching_right_item`
--
ALTER TABLE `matching_right_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_MATCH_RIGHT_QUESTION` (`question_id`);

--
-- A tábla indexei `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_QUESTION_QUIZ` (`quiz_id`);

--
-- A tábla indexei `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_QUIZ_USER` (`created_by`);

--
-- A tábla indexei `quiz_attempt`
--
ALTER TABLE `quiz_attempt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_quiz` (`user_id`,`quiz_id`),
  ADD KEY `IDX_ATTEMPT_QUIZ` (`quiz_id`);

--
-- A tábla indexei `quiz_viewer_email`
--
ALTER TABLE `quiz_viewer_email`
  ADD KEY `IDX_VIEWER_QUIZ` (`quiz_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `answer_option`
--
ALTER TABLE `answer_option`
  ADD CONSTRAINT `FK_ANSWER_OPTION_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `matching_left_item`
--
ALTER TABLE `matching_left_item`
  ADD CONSTRAINT `FK_LEFT_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `matching_pair`
--
ALTER TABLE `matching_pair`
  ADD CONSTRAINT `FK_PAIR_LEFT` FOREIGN KEY (`left_id`) REFERENCES `matching_left_item` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PAIR_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PAIR_RIGHT` FOREIGN KEY (`right_id`) REFERENCES `matching_right_item` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `matching_right_item`
--
ALTER TABLE `matching_right_item`
  ADD CONSTRAINT `FK_RIGHT_QUESTION` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `FK_QUESTION_QUIZ` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `FK_QUIZ_USER` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `quiz_attempt`
--
ALTER TABLE `quiz_attempt`
  ADD CONSTRAINT `FK_QA_QUIZ` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_QA_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `quiz_viewer_email`
--
ALTER TABLE `quiz_viewer_email`
  ADD CONSTRAINT `FK_VIEWER_QUIZ` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
