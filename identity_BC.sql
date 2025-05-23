-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 14, 2025 at 04:54 AM
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
-- Database: `identity_BC`
--

-- --------------------------------------------------------

--
-- Table structure for table `qr_codes`
--

CREATE TABLE `qr_codes` (
  `id` int(11) NOT NULL,
  `degree_id` varchar(255) NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `refresh_token` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `refresh_token`, `expires_at`, `created_at`) VALUES
(1, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJjb25nX2NhbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ2MTY3MTYyLCJleHAiOjE3NDYyNTM1NjJ9.kBc_7ISdNDpGXKX05QQVHBzZkCVpVvBPfBRvWyS10Y4', '73f689f15d3f5cd8064ec42283f88e22713a5f47499c05f7260f46861e0fd156161eb77dbee6e78783c1714c404fa86adb4bce94544502802717c19741ec8dc2', '2025-05-09 13:26:02', '2025-05-02 13:26:02'),
(2, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MTcwMjg0LCJleHAiOjE3NDYyNTY2ODR9.RCrxiL8EFIOhqg0FDjhEMNoiGrIDOsse7zwxXUOP92o', 'c4c0ef3359727b088a3d43b0e45984886db4cfc60fd07447ee1dfb9533e004dae4b3a1218c27f47a4e6f5615ce8394be4756f7e469b715ed6e10573e1a78ceaa', '2025-05-09 14:18:04', '2025-05-02 14:18:04'),
(3, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MTcyMTM3LCJleHAiOjE3NDYyNTg1Mzd9.eYT1_wf3cskrA1tvv6g_wKkK7fofP21tRR2X00I2udQ', '722f6e92cb1b6fcc058882f27c2c4c6da6ceafeff0f8b21bf3c002e6c1b9f1413b40ec5b0ecb51db1d9dcec7170ecd64592e1aa6a6f43e6fa6ce6c6b471c598a', '2025-05-09 14:48:57', '2025-05-02 14:48:57'),
(4, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJjb25nX2NhbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ2MTcyMTgyLCJleHAiOjE3NDYyNTg1ODJ9.KbFkdCHOcwPUv6YDixeSDZKSM2SQnpIpAyXCPYX_Tu8', '1fdb4bced1dd1d517d3fc15ea17f26a72ff14156102a83fe1d0a3e48e2bd1007208a3154286d685662faa5137d95a6acd6d7564a7b9f455205a825f5b2303bce', '2025-05-09 14:49:42', '2025-05-02 14:49:42'),
(5, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjM3MTI1LCJleHAiOjE3NDYzMjM1MjV9.0U4H3K6J4m43N2ZqOK7eK3F36mIhL1dFFoEHGkQQ5X0', '33869138a56a750b8c0f51187f58f61361dd496900c8d38762648819ad1e72ec672edf18a14c00e641e4a52694449d6378edab2a9d047c988543aa049bfddf4c', '2025-05-10 08:52:05', '2025-05-03 08:52:05'),
(6, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjM3MTk3LCJleHAiOjE3NDYzMjM1OTd9.Cbd7xa3HTyMzck2Vtcf2FYbqmPJY84UkYLNcIr9IkSk', '7a93d8b56e327a28433aacf908e212fa907057a63e88b115db31d482ac049c3c6e8e4fab64577634d0ede9634b7ea9670c48a048308df54fef24f72d2a04096f', '2025-05-10 08:53:17', '2025-05-03 08:53:17'),
(7, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjM4NTcxLCJleHAiOjE3NDYzMjQ5NzF9.kLp7p4jJ5U7lrqusA2xYwwDXxX24BTPBbTrsl_cZsyw', 'd64a0a426f3abc9d4015c98f39ce94836cc8821eba068054b1b8ec87611f09de951ea3dc3c7fa814b409313ee429e988a44a94914d90b053636c4013869cd12f', '2025-05-10 09:16:11', '2025-05-03 09:16:11'),
(8, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjQxMDk4LCJleHAiOjE3NDYzMjc0OTh9.YSddJn5MLjVAR868R00HBUUMWbJkwytyfC3sYpVf-WM', 'f342ef6499be23e3def95ce88c8001bdee5d6fac6dddb4d34975672e7c41bb2e4e2243829e1042949907acccbf153694c1c7fa8a69599140b5791066de7e09f3', '2025-05-10 09:58:18', '2025-05-03 09:58:18'),
(9, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjQxMTg3LCJleHAiOjE3NDYzMjc1ODd9.bzS7OeDM3SPaYCKSjaGAYS-vlQ-6XQxGpSrm_6VHZUU', 'f73ce88f6639aabf97b6bdec97739cb50e7a5cdea4e6bfd376a8a22d6633f3d8e786415774a89893ef1233e064b7f1413b45389e12166b4cf4a53ab68aa39496', '2025-05-10 09:59:47', '2025-05-03 09:59:47'),
(10, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjQyNjU4LCJleHAiOjE3NDYzMjkwNTh9.IZK8wFhn72m1bgcv30y5cp8DkXF1dqzA4ouksi1K__s', '71eb3a02830177473804c68fdff95d7cac2903bfa561f26204fb09101cee059fb6a4e4d8d986479a2c3b648dcc57c5738234af3bba77d8d8dc23b1f4cc8cbed6', '2025-05-10 10:24:18', '2025-05-03 10:24:18'),
(11, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJjb25nX2NhbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ2MjQyODkyLCJleHAiOjE3NDYzMjkyOTJ9.MiwU4Y9XkXKORMM70Gg2qAIH6wu39hLonI3pY2iZcBE', '2b6a14817d31f22e2986cce56f7e8031fb02ffd3e47546eeee3e48f5e098ac915a6a03756c508b8d767d099f01997065b8a27368570ab11030851421143ca748', '2025-05-10 10:28:12', '2025-05-03 10:28:12'),
(12, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJjb25nX2NhbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ2MjQzMjUzLCJleHAiOjE3NDYzMjk2NTN9.TMyEcTxXYzZ5fDXc79UdyJefykAJy133i_2smqCUQPI', '4d3f30ef20c2818901ddc5c0717fd135ea1c123812643d6a9cf4ad1675344752d1579f61dfe4cdc56acc11c9dad76d24febd72c85d0971da292a17d17059597a', '2025-05-10 10:34:13', '2025-05-03 10:34:13'),
(13, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2MjQzMjgzLCJleHAiOjE3NDYzMjk2ODN9.b_xOQnP50g1OdHjeE0j-biGfcnA67lBxPMvtBCgd78A', '0c8be416c8ebac423b76973e656944a4c8cd7faa7dd4c66ce92c34587e2440d40557e16408e2980a8d2b1a78a95082b8a679f7180a39c479db19b0a27b23cff9', '2025-05-10 10:34:43', '2025-05-03 10:34:43'),
(14, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJjb25nX2NhbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ2MjQzMzA0LCJleHAiOjE3NDYzMjk3MDR9.CkX22u-Z-MuGKvY0x72sNZsLNnFAEpR2Zn8eTp87MK4', 'f2158e3ddf808fabeea5bf4333b567f06bab1e5b6b94816fc462d6b2393b4caea60b04b7cd400081f3cca2ecfa7bcd7ce3efd1312148edf56bc86e90f05ac8da', '2025-05-10 10:35:04', '2025-05-03 10:35:04'),
(15, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJjb25nX2NhbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ2MjQ0OTUwLCJleHAiOjE3NDYzMzEzNTB9.TE2jvVmMwKzFjItMko-gQJS-V_lOQkhkPeya7tE4M-Y', '95fac051f7651956fa687feac134567af11d07276e2c86861cb3ff0d67f24ec4b55f420725a6a24acdf97ab3b12ed8a35c94b9ea6d039f499927c842b6c701ab', '2025-05-10 11:02:30', '2025-05-03 11:02:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `citizen_id` char(12) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `dob` date NOT NULL,
  `common_name` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `organizational_unit` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `locality` varchar(255) DEFAULT NULL,
  `certificate` text DEFAULT NULL,
  `public_key` longblob DEFAULT NULL,
  `private_key` longblob DEFAULT NULL,
  `enrollment_secret` varchar(255) DEFAULT NULL,
  `pin_code` char(6) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `citizen_id`, `role`, `dob`, `common_name`, `organization`, `organizational_unit`, `country`, `state`, `locality`, `certificate`, `public_key`, `private_key`, `enrollment_secret`, `pin_code`, `created_at`) VALUES
(1, 'hieu_phan', 'phanconghieu12@gmail.com', '008894489911', 'user', '2003-03-29', 'Phan Công Hiệu', 'Org1', 'IT', 'US', 'California', 'San Francisco', '-----BEGIN CERTIFICATE-----\nMIICjTCCAjSgAwIBAgIUMoDG8JUIijUVsUXmePYwQeVA2L0wCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTI1MDQxOTA5MzUwMFoXDTI2MDUwMjA2MjAwMFowRjEwMAsG\nA1UECxMEb3JnMTANBgNVBAsTBmNsaWVudDASBgNVBAsTC2RlcGFydG1lbnQxMRIw\nEAYDVQQDDAloaWV1X3BoYW4wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASxuFr8\n3DIHROftrxBUi/gNNuGb1WcVI2Jjn8gJwZjBTg1Y/YUFqfbPng8vWkXD8xtf8wVL\nxw0gQgqZd4CcMZtIo4HdMIHaMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAA\nMB0GA1UdDgQWBBSjSErlZInhrSRpYeZTLhNz07E4jjAfBgNVHSMEGDAWgBSlo75x\nFnKm4ri/SwA3n8szLQqA5DB6BggqAwQFBgcIAQRueyJhdHRycyI6eyJoZi5BZmZp\nbGlhdGlvbiI6Im9yZzEuZGVwYXJ0bWVudDEiLCJoZi5FbnJvbGxtZW50SUQiOiJo\naWV1X3BoYW4iLCJoZi5UeXBlIjoiY2xpZW50Iiwicm9sZSI6InVzZXIifX0wCgYI\nKoZIzj0EAwIDRwAwRAIgJrUl/tyCwVoOXUQbduIynn8EOyiJXLF5jfXoHzoiwVwC\nICofudQtqLIzga/IXiyUTDWWky9WW79gU/h+RNpk8Ix2\n-----END CERTIFICATE-----\n', 0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0d0a4d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a30444151634451674145736268612f4e77794230546e3761385156497634445462686d39566e0d0a46534e6959352f49436347597755344e5750324642616e327a3534504c317046772f4d62582f4d465338634e4945494b6d5865416e44476253413d3d0d0a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0d0a, 0x2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0d0a4d494748416745414d424d4742797147534d34394167454743437147534d3439417745484247307761774942415151676b4b42424f787232414d392b704e36440d0a5a6772714664426667496d63516c4568734943612f4a315470794b6852414e43414153787546723833444948524f667472784255692f674e4e754762315763560d0a49324a6a6e38674a775a6a42546731592f595546716662506e673876576b5844387874663877564c787730675167715a643443634d5a74490d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0d0a, 'RWVVIIyONVjv', NULL, '2025-05-02 13:19:44'),
(2, 'cong_cao', 'caotancongsof@gmail.com', '008894486611', 'user', '2003-10-26', 'Cao Tấn Công', 'Org1', 'IT', 'US', 'California', 'San Francisco', '-----BEGIN CERTIFICATE-----\nMIICizCCAjKgAwIBAgIUCJkMaCcySN69m3jXFQ20QTUNMvcwCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTI1MDQxOTA5MzUwMFoXDTI2MDUwMjA2MjEwMFowRTEwMAsG\nA1UECxMEb3JnMTANBgNVBAsTBmNsaWVudDASBgNVBAsTC2RlcGFydG1lbnQxMREw\nDwYDVQQDDAhjb25nX2NhbzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABIX+NAiZ\nllThNYPfVwbSjxdpD6STU90uMM6BgiviWdC+FP9R8dT33EzYwBQb4CZgziqz2Z6M\nwz4BYk6rqRmAW/mjgdwwgdkwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAw\nHQYDVR0OBBYEFC+EJVeOPrMhe+vBAsNjNjVmIwmOMB8GA1UdIwQYMBaAFKWjvnEW\ncqbiuL9LADefyzMtCoDkMHkGCCoDBAUGBwgBBG17ImF0dHJzIjp7ImhmLkFmZmls\naWF0aW9uIjoib3JnMS5kZXBhcnRtZW50MSIsImhmLkVucm9sbG1lbnRJRCI6ImNv\nbmdfY2FvIiwiaGYuVHlwZSI6ImNsaWVudCIsInJvbGUiOiJ1c2VyIn19MAoGCCqG\nSM49BAMCA0cAMEQCIQDIfCnE/KeFJ3puig+Wm3PgW7ZeGSeIxxg0GMo5mT0wDgIf\nHHK2KUSKY4+EbUQN0y9NZBDCOSrKFO2N+O7CvDZSPg==\n-----END CERTIFICATE-----\n', 0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0d0a4d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a3044415163445167414568663430434a6d57564f45316739395842744b5046326b50704a4e540d0a335334777a6f47434b2b4a5a304c34552f31487831506663544e6a41464276674a6d444f4b72505a6e6f7a445067466954717570475942622b513d3d0d0a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0d0a, 0x2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0d0a4d494748416745414d424d4742797147534d34394167454743437147534d3439417745484247307761774942415151674734586964767375774a6a2f455044680d0a59334459674b6b6c456675513138716c56464a2f6b5139484376366852414e43414153462f6a51496d5a5a553454574433316347306f385861512b6b6b3150640d0a4c6a444f67594972346c6e517668542f556648553939784d324d4155472b416d594d347173396d656a4d4d2b41574a4f71366b5a674676350d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0d0a, '123#', NULL, '2025-05-02 13:21:10'),
(3, 'administrator', 'ln5966220@gmail.com', '009994486611', 'admin', '2003-06-28', 'Nguyễn Thị Thanh Thảo', 'Org1', 'IT', 'US', 'California', 'San Francisco', '-----BEGIN CERTIFICATE-----\nMIICljCCAj2gAwIBAgIULr27eGffmKRgW8EgFCS7prqsBFEwCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTI1MDQxOTA5MzUwMFoXDTI2MDUwMjA2MjgwMFowSjEwMAsG\nA1UECxMEb3JnMTANBgNVBAsTBmNsaWVudDASBgNVBAsTC2RlcGFydG1lbnQxMRYw\nFAYDVQQDEw1hZG1pbmlzdHJhdG9yMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\nka1uLs02UiXcSVExpGUYnTgHGwfkBPjrSvID19PaUzfYJG0H2Vbn3neW1NninG9G\nGLbEwSj3wdSaSHDWIEwrLaOB4jCB3zAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/\nBAIwADAdBgNVHQ4EFgQU6es9+q4SjkOeZdvRJudli8mxV+EwHwYDVR0jBBgwFoAU\npaO+cRZypuK4v0sAN5/LMy0KgOQwfwYIKgMEBQYHCAEEc3siYXR0cnMiOnsiaGYu\nQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYuRW5yb2xsbWVudElE\nIjoiYWRtaW5pc3RyYXRvciIsImhmLlR5cGUiOiJjbGllbnQiLCJyb2xlIjoiYWRt\naW4ifX0wCgYIKoZIzj0EAwIDRwAwRAIgVnZL9s8u+sat4R4pa10XfvqHFrv7e+Y+\nKR2TLqovaIwCIEzwl285Tey6YFIMA83xAX+0mCc/5uEuldJh5bJiFnbu\n-----END CERTIFICATE-----\n', 0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0d0a4d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a304441516344516741456b6131754c7330325569586353564578704755596e5467484777666b0d0a42506a725376494431395061557a66594a4730483256626e336e6557314e6e696e473947474c624577536a337764536153484457494577724c513d3d0d0a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0d0a, 0x2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0d0a4d494748416745414d424d4742797147534d34394167454743437147534d34394177454842473077617749424151516763326c4c45696448736e545643394c4b0d0a4649787759595a64536c786a3667547a525872744e537563484c326852414e4341415352725734757a545a534a64784a5554476b5a5269644f416362422b51450d0a2b4f744b38675058303970544e39676b6251665a567566656435625532654b6362305959747354424b506642314a7049634e5967544373740d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0d0a, 'admin123#', NULL, '2025-05-02 13:28:00'),
(4, 'dung_nguyen', 'nguyendunggl2308@gmail.com', '191283919098', 'user', '2002-08-23', 'Nguyễn Thế Dũng', 'Org1', 'IT', 'US', 'California', 'San Francisco', '-----BEGIN CERTIFICATE-----\nMIICkjCCAjigAwIBAgIULhz6ktneOOAerjCgpX6972mPrMIwCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTI1MDQxOTA5MzUwMFoXDTI2MDUwMjA4MDAwMFowSDEwMAsG\nA1UECxMEb3JnMTANBgNVBAsTBmNsaWVudDASBgNVBAsTC2RlcGFydG1lbnQxMRQw\nEgYDVQQDDAtkdW5nX25ndXllbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABCOO\nk/NPGKrvtYlbITq2Da4JpGHXLmNQ4HMGWtkRA9p74ftxdxDodrB6KPbgxX7CuhgS\nFk2SlEx7GCNaL9dTnzejgd8wgdwwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQC\nMAAwHQYDVR0OBBYEFJB6fAfBZc+QgFqnY1/kS1oBlwKNMB8GA1UdIwQYMBaAFKWj\nvnEWcqbiuL9LADefyzMtCoDkMHwGCCoDBAUGBwgBBHB7ImF0dHJzIjp7ImhmLkFm\nZmlsaWF0aW9uIjoib3JnMS5kZXBhcnRtZW50MSIsImhmLkVucm9sbG1lbnRJRCI6\nImR1bmdfbmd1eWVuIiwiaGYuVHlwZSI6ImNsaWVudCIsInJvbGUiOiJ1c2VyIn19\nMAoGCCqGSM49BAMCA0gAMEUCIQCLechfTtRdEjDYGexnDwnn4o/3zy9R1H9zXlLF\ndX/+CQIgfNykZPkxdqL1zjGproK/k23zE0jO+tL6X3FEsJkeHfQ=\n-----END CERTIFICATE-----\n', 0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0d0a4d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a30444151634451674145493436543830385971752b31695673684f72594e72676d6b596463750d0a5931446763775a6132524544326e76682b334633454f683273486f6f3975444666734b3647424957545a4b555448735949316f7631314f664e773d3d0d0a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0d0a, 0x2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0d0a4d494748416745414d424d4742797147534d34394167454743437147534d343941774548424730776177494241515167366b2b676b36523170654c4f676c5a420d0a5a6436714d65716655416d664767314178387376476a7a526254656852414e434141516a6a70507a547869713737574a5779453674673275436152683179356a0d0a554f427a426c725a45515061652b4837635863513648617765696a32344d562b77726f5945685a4e6b70524d6578676a57692f58553538330d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0d0a, 'iganOSnleWSp', NULL, '2025-05-02 15:00:02'),
(5, 'Hhhhhhh', 'anh404128@gmail.com', '123456789123', 'user', '2001-03-24', 'Nguyễn Văn A', 'Org1', 'IT', 'US', 'California', 'San Francisco', '-----BEGIN CERTIFICATE-----\nMIICijCCAjCgAwIBAgIUCQkGGeUv+L7mR+oCV2ft5Kj2SIUwCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTI1MDQxOTA5MzUwMFoXDTI2MDUwMjA4MDMwMFowRDEwMAsG\nA1UECxMEb3JnMTANBgNVBAsTBmNsaWVudDASBgNVBAsTC2RlcGFydG1lbnQxMRAw\nDgYDVQQDEwdIaGhoaGhoMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEe6Ottus\n/MaB/o/GbNz8Xbplvl5ruP4NGJJqXNd6tRDsgDZ/N0esIs/tsdkoghiG4SxNX/2e\nFdNKKTVwD+EB3aOB2zCB2DAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAd\nBgNVHQ4EFgQU8UpJX2bEj6iVIvRdADFpnq5obD4wHwYDVR0jBBgwFoAUpaO+cRZy\npuK4v0sAN5/LMy0KgOQweAYIKgMEBQYHCAEEbHsiYXR0cnMiOnsiaGYuQWZmaWxp\nYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYuRW5yb2xsbWVudElEIjoiSGho\naGhoaCIsImhmLlR5cGUiOiJjbGllbnQiLCJyb2xlIjoidXNlciJ9fTAKBggqhkjO\nPQQDAgNIADBFAiEArIbAFueFiEsrY12Et0sx8LRvfAOw6HRg06HxuQl2+vcCIC4B\nXV9eAdQArINO+b02ygFxiDnT4KJcIgEQzFo6UcaW\n-----END CERTIFICATE-----\n', 0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0d0a4d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a304441516344516741454565364f747475732f4d61422f6f2f47624e7a385862706c766c35720d0a7550344e474a4a71584e64367452447367445a2f4e30657349732f7473646b6f676869473453784e582f326546644e4b4b545677442b454233513d3d0d0a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0d0a, 0x2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0d0a4d494748416745414d424d4742797147534d34394167454743437147534d34394177454842473077617749424151516741732f506f6f364144456661774e6d570d0a6c374b494849596e2f394e676b4f4e75734d5168505847356d50656852414e4341415152376f363232367a38786f482b6a385a7333507864756d572b586d75340d0a2f6730596b6d706331337131454f79414e6e3833523677697a2b327832536943474962684c4531662f5a345630306f704e584150345148640d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0d0a, 'ZRCfiMdNUFDR', NULL, '2025-05-02 15:03:11'),
(6, 'Hhhhhhh112', 'van282854@gmail.com', '123456789122', 'user', '2001-03-22', 'Nguyễn Văn B', 'Org1', 'IT', 'US', 'California', 'San Francisco', '-----BEGIN CERTIFICATE-----\nMIICjzCCAjagAwIBAgIUZ50jysm3cEY5OsyC85/dM5trJg8wCgYIKoZIzj0EAwIw\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\nY2Etc2VydmVyMB4XDTI1MDQxOTA5MzUwMFoXDTI2MDUwMjA4MDUwMFowRzEwMAsG\nA1UECxMEb3JnMTANBgNVBAsTBmNsaWVudDASBgNVBAsTC2RlcGFydG1lbnQxMRMw\nEQYDVQQDEwpIaGhoaGhoMTEyMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEYl03\np2CeLyDE/CYvCq+KARPs7S/6lvIuEjwqiC9uCQpjmC33i4TAIoG/CyBrPbsTAPcs\nw5N24smASXUwlPrtgqOB3jCB2zAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIw\nADAdBgNVHQ4EFgQUBgUUAzxP8mjQ6E/lhKBQMkjS/bMwHwYDVR0jBBgwFoAUpaO+\ncRZypuK4v0sAN5/LMy0KgOQwewYIKgMEBQYHCAEEb3siYXR0cnMiOnsiaGYuQWZm\naWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYuRW5yb2xsbWVudElEIjoi\nSGhoaGhoaDExMiIsImhmLlR5cGUiOiJjbGllbnQiLCJyb2xlIjoidXNlciJ9fTAK\nBggqhkjOPQQDAgNHADBEAiAWqvDbDUJ1+Iw0B/hLxRibHGWtqNDEcTZhFRrW9jsP\nGwIgHP7psgt0a9/xr5LpPj5pWDfMqfV/7Qfz+wj9aXKfenQ=\n-----END CERTIFICATE-----\n', 0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0d0a4d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a30444151634451674145596c3033703243654c7944452f43597643712b4b4152507337532f360d0a6c764975456a7771694339754351706a6d43333369345441496f472f43794272506273544150637377354e3234736d41535855776c50727467673d3d0d0a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0d0a, 0x2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0d0a4d494748416745414d424d4742797147534d34394167454743437147534d34394177454842473077617749424151516739797a774266385a583432346f2f38300d0a316b69734d375846787a484b4c32796459614a62727843414879616852414e43414152695854656e594a3476494d54384a69384b72346f42452b7a744c2f71570d0a38693453504371494c32344a436d4f594c66654c684d41696762384c4947733975784d4139797a446b3362697959424a645443552b7532430d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0d0a, 'LNfsWPwopHJJ', NULL, '2025-05-02 15:04:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `qr_codes`
--
ALTER TABLE `qr_codes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `citizen_id` (`citizen_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `qr_codes`
--
ALTER TABLE `qr_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
