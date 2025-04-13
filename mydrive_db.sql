-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2023 at 04:29 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydrive_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--
CREATE DATABASE mydrive_db;
USE mydrive_db;

CREATE TABLE `folders` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT 0,
  `trash` tinyint(1) NOT NULL DEFAULT 0,
  `share_mode` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `folders`
--

INSERT INTO `folders` (`id`, `name`, `date_created`, `user_id`, `parent`, `trash`, `share_mode`) VALUES
(1, 'my folder', '2023-03-21 15:11:37', 1, 0, 0, 0),
(3, 'folder in folder', '2023-03-22 17:18:32', 1, 0, 0, 0),
(5, 'folder in folder3', '2023-03-22 17:20:29', 1, 1, 0, 0),
(6, 'folder in folder4', '2023-03-22 17:20:57', 1, 5, 0, 0),
(7, 'My folder', '2023-04-21 09:23:30', 4, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `mydrive`
--

CREATE TABLE `mydrive` (
  `id` int(11) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `file_size` int(11) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_path` varchar(1024) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL DEFAULT current_timestamp(),
  `trash` tinyint(1) NOT NULL DEFAULT 0,
  `favorite` tinyint(1) NOT NULL DEFAULT 0,
  `folder_id` int(11) NOT NULL DEFAULT 0,
  `share_mode` tinyint(1) NOT NULL DEFAULT 0,
  `slug` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mydrive`
--

INSERT INTO `mydrive` (`id`, `file_name`, `file_size`, `file_type`, `file_path`, `user_id`, `date_created`, `date_updated`, `trash`, `favorite`, `folder_id`, `share_mode`, `slug`) VALUES
(3, 'tfpdl-ggrt2072wd.mkv', 853921609, 'video/x-matroska', 'uploads/1679309721tfpdl-ggrt2072wd.mkv', 1, '2023-03-20 11:55:21', '2023-03-20 11:55:21', 0, 0, 0, 0, 'TRyVJJgvcjTBbPHNpNt'),
(4, 'Turning Red (2022) (NetNaija.com).mp4', 462425213, 'video/mp4', 'uploads/1679309741Turning Red (2022) (NetNaija.com).mp4', 1, '2023-03-20 11:55:41', '2023-03-20 11:55:41', 0, 0, 0, 1, 'UGWK7KJSDMb'),
(5, 'New Text Document.txt', 0, 'text/plain', 'uploads/1679309781New Text Document.txt', 1, '2023-03-20 11:56:21', '2023-03-20 11:56:21', 0, 0, 0, 2, 'zrebiG6m55pLC5u9FU_D0MMl0Fqp80mvSY1HRSm'),
(6, 'TSOKA.docx', 26732, 'application/vnd.openxmlformats-officedocument.word', 'uploads/1679309781TSOKA.docx', 1, '2023-03-20 11:56:21', '2023-03-20 11:56:21', 0, 0, 0, 1, 'tVq6hdviGftB_LgR0-zLiuE1tAiYh92cGiXpw4E1ZpIpfgi'),
(7, 'Pinocchio A True Story (2021) (NetNaija.com).mp4', 329191904, 'video/mp4', 'uploads/1679312199Pinocchio A True Story (2021) (NetNaija.com).mp4', 1, '2023-03-20 12:36:39', '2023-03-20 12:36:39', 0, 0, 0, 2, 'nDACYRXLswYUtNBQh8gs9D'),
(9, 'pos.psd', 2920586, 'application/octet-stream', 'uploads/1679501566pos.psd', 1, '2023-03-22 17:12:46', '2023-03-22 17:12:46', 0, 0, 1, 0, 'ab4U5rln3lM-ix13vlQmUcdrn9DRmzARcM2bP0fI'),
(10, 'Wallace ft Gary Canon-_Why (Prod by XhugarBowl).mp3', 4494654, 'audio/mpeg', 'uploads/1679501600Wallace ft Gary Canon-_Why (Prod by XhugarBowl).mp3', 1, '2023-03-22 17:13:20', '2023-03-22 17:13:20', 0, 0, 1, 0, 'KW5JVuYmrzVbuqocNyvuH1Vb32w3BN0'),
(11, 'medium-shot-woman-recording-podcast-indoors_23-2149446213.jpg', 101890, 'image/jpeg', 'uploads/1681283960medium-shot-woman-recording-podcast-indoors_23-2149446213.jpg', 1, '2023-04-12 09:19:20', '2023-04-12 09:19:20', 0, 1, 0, 1, 'HLSI09Du3KpGeBcTQczYagzL8eAmWxbdl_EdeyBbasF5'),
(12, 'i wanna be.mp3', 4243987, 'audio/mpeg', 'uploads/1681666193i wanna be.mp3', 1, '2023-04-16 19:29:53', '2023-04-16 19:29:53', 0, 0, 0, 0, '8TLXtLYpLH0rAamoi7L-4u9kMjIft955OY6F-C9-_3_'),
(13, 'DC League of Super-Pets (2022) (NetNaija.com).mp4', 247399236, 'video/mp4', 'uploads/1682060775DC League of Super-Pets (2022) (NetNaija.com).mp4', 1, '2023-04-21 09:06:15', '2023-04-21 09:06:15', 0, 0, 0, 0, 'i3TRV3GKw_ZgzHVw01Iw7MqzoyPFwOK3DI6g2I9z8QlwJZ'),
(14, 'beautiful-happy-african-american-woman-has-surprised-joyful-expression-cannot-believe-sudden-success', 41227, 'image/jpeg', 'uploads/1682061491beautiful-happy-african-american-woman-has-surprised-joyful-expression-cannot-believe-sudden-success-dressed-casual-white-jumper_273609-43273.jpg', 3, '2023-04-21 09:18:11', '2023-04-21 09:18:11', 0, 0, 0, 0, 'u_Ind85n7Ilx4P2mPGwOFwXXQZPs2glxj'),
(15, 'builder-young-man-construction-uniform-safety-helmet-holding-wrench-pliers-looking-confused-with-han', 219677, 'image/png', 'uploads/1682061837builder-young-man-construction-uniform-safety-helmet-holding-wrench-pliers-looking-confused-with-hand-his-head-mistake-standing-blue-background_141793-140410.png', 4, '2023-04-21 09:23:57', '2023-04-21 09:23:57', 0, 0, 0, 1, 'oE2l9ne0rGF3fSETjz9Gp1cl9g'),
(16, 'Bunyan.and.Babe.2017.WEB-DL.x264-FGT.mp4', 777302248, 'video/mp4', 'uploads/1682061985Bunyan.and.Babe.2017.WEB-DL.x264-FGT.mp4', 2, '2023-04-21 09:26:25', '2023-04-21 09:26:25', 0, 0, 0, 0, 'F-HuXcDiDI22stGZXHnP7DJmxuggY35Hk6C'),
(17, 'Batman-The-Doom-That-Came-to-Gotham-2023-STAGATV-COM.mp4', 237539430, 'video/mp4', 'uploads/1682062605Batman-The-Doom-That-Came-to-Gotham-2023-STAGATV-COM.mp4', 4, '2023-04-21 09:36:45', '2023-04-21 09:36:45', 0, 1, 0, 0, '_jloE1wqziNQySMD');

-- --------------------------------------------------------

--
-- Table structure for table `shared_to`
--

CREATE TABLE `shared_to` (
  `id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `disabled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shared_to`
--

INSERT INTO `shared_to` (`id`, `file_id`, `email`, `disabled`) VALUES
(1, 11, 'email3', 1),
(2, 11, 'email2', 1),
(3, 11, 'email1', 1),
(4, 11, 'email@email.com', 0),
(5, 11, 'john@gmail.co.uk', 0),
(6, 11, 'mary@email.com', 0),
(7, 15, 'email@email.com', 0),
(8, 15, 'mary@email.com', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `date_created`, `date_updated`) VALUES
(1, 'Eathorne', 'email@email.com', '$2y$10$6g7OFcX.5ovhQtdCZcPgveivMtzoSxxyd/Xz3PDRF2DftpLm6KZZe', '2023-03-18 13:22:09', '2023-03-18 13:22:09'),
(2, 'Mary', 'mary@email.com', '$2y$10$3TdpcVRC.4cdziOthPw7.OS17LI14RWf6m1kFTpcaJVREsruFv1Jm', '2023-03-18 13:23:59', '2023-03-18 13:23:59'),
(3, 'John', 'john@email.com', '$2y$10$OX2q0qBMKaN7cqHCXXeUnuf3u4HYRqO5DFLZKxPCgJQLdVRJsugai', '2023-04-21 09:15:02', '2023-04-21 09:15:02'),
(4, 'Peter', 'peter@email.com', '$2y$10$YKx1jyz2xsjSlpA9P2Bs4.qTC4QRvhphOO6J9GPS0Nxit/oqfkVSq', '2023-04-21 09:22:34', '2023-04-21 09:22:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `trash` (`trash`),
  ADD KEY `share_mode` (`share_mode`);

--
-- Indexes for table `mydrive`
--
ALTER TABLE `mydrive`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `file_name` (`file_name`),
  ADD KEY `trash` (`trash`),
  ADD KEY `favorite` (`favorite`),
  ADD KEY `folder_id` (`folder_id`),
  ADD KEY `slug` (`slug`);

--
-- Indexes for table `shared_to`
--
ALTER TABLE `shared_to`
  ADD PRIMARY KEY (`id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `disabled` (`disabled`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mydrive`
--
ALTER TABLE `mydrive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `shared_to`
--
ALTER TABLE `shared_to`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
