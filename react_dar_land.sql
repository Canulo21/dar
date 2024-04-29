-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2024 at 12:50 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react_dar_land`
--

-- --------------------------------------------------------

--
-- Table structure for table `arbs`
--

CREATE TABLE `arbs` (
  `landowner_cloa_title_no` varchar(255) NOT NULL,
  `arb_cloa_title_no` varchar(100) NOT NULL,
  `arb_lot_no` varchar(100) NOT NULL,
  `arb_area_individual` varchar(100) NOT NULL,
  `date_registered` date DEFAULT NULL,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `gender` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `landowners`
--

CREATE TABLE `landowners` (
  `id` int(11) NOT NULL,
  `landowner_cloa_title_no` varchar(255) NOT NULL,
  `landowner_lot_no` varchar(100) NOT NULL,
  `area_amended` varchar(50) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `corporate_name` varchar(200) NOT NULL,
  `region` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `prog_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `landowners`
--

INSERT INTO `landowners` (`id`, `landowner_cloa_title_no`, `landowner_lot_no`, `area_amended`, `fname`, `mname`, `lname`, `corporate_name`, `region`, `province`, `municipality`, `barangay`, `prog_type`) VALUES
(6, '21', '21', '21', '21', '21', '21', '21', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `mname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `fname`, `mname`, `lname`, `username`, `password`) VALUES
(1, 'Jhon Carlo', 'Sabuero', 'Canulo', 'carol21', '$2b$10$iNQVRk7.OB4OUwbEZ8aX..DY0TTzNIuLz9AqKPEeFYNXd4awHJVGK'),
(2, 'Carol', 'Canulo', 'Jangad', 'carol2121', '$2b$10$VcdK7yT9AS4juNThr1spg.sb9jaVXsyAe0pNB9MzMR69AQDtInc0C'),
(3, 'Jhon Carlo', 'Sabuero', 'Canulo', 'Admin1234', '$2b$10$T8bkAP.RWJ.YzRCUlWUr0O0m0IJ8J8kdlrhwbTeXApvavIhPppyhW'),
(4, 'Cressa', 'Capayas', 'Pasanting', '12345', '$2b$10$dcAMz6lRghQyMpKjMWJGr.Dh1r4CdMzh1QTE2lNu3CGsnCVRhWwZi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `landowners`
--
ALTER TABLE `landowners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `landowners`
--
ALTER TABLE `landowners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
