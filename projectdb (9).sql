-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2026 at 03:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `addbrand`
--

CREATE TABLE `addbrand` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `displayorder` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addbrand`
--

INSERT INTO `addbrand` (`id`, `name`, `displayorder`, `status`) VALUES
(1, 'Nike', 1, 1),
(2, 'Dabur', 2, 1),
(3, 'Sony', 3, 1),
(4, 'Red Tape', 4, 1),
(5, 'Roadster', 5, 1),
(6, 'Allen Solly', 6, 1),
(8, 'Vaseline', 7, 0);

-- --------------------------------------------------------

--
-- Table structure for table `addcategory`
--

CREATE TABLE `addcategory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `displayorder` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addcategory`
--

INSERT INTO `addcategory` (`id`, `name`, `displayorder`, `status`) VALUES
(1, 'women', 1, 1),
(2, 'Men', 2, 1),
(3, 'Fashion & Beauty', 3, 1),
(4, 'Food Products', 4, 0),
(5, 'Home & Furniture', 5, 0),
(6, 'Electronics', 6, 0),
(7, 'Mobiles', 7, 0),
(8, 'Home & Kitchen', 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `addpage`
--

CREATE TABLE `addpage` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `displayorder` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addpage`
--

INSERT INTO `addpage` (`id`, `name`, `title`, `content`, `displayorder`, `status`) VALUES
(1, 'Home', 'Home page', 'hhnh jhjb mhb  mjh', 1, 1),
(2, 'Shop', 'Shop page', 'gfcdfgwd degwhfv fewgfeg egfevh', 2, 1),
(3, 'About Us', 'About Us', 'This is the About Us page', 3, 1),
(4, 'My Account', 'My Account', 'This is the My Account page', 4, 1),
(5, 'Contact Us', 'Contact Us page', 'This is the Contact Us page', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `addpartner`
--

CREATE TABLE `addpartner` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `displayorder` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addpartner`
--

INSERT INTO `addpartner` (`id`, `name`, `image`, `link`, `displayorder`, `status`) VALUES
(1, 'Quintines', '/uploads/1773716807633-230188050.png', 'Quintines.com', 1, 1),
(2, 'indiaCapital', '/uploads/1773717016378-173745742.png', 'indiacapital.com', 2, 1),
(3, 'paperlinx', '/uploads/1773717089912-935534212.png', 'paperlinx.com', 3, 1),
(4, 'infraRed', '/uploads/1773717181124-879090563.png', 'infrared.com', 4, 1),
(5, 'Erlang', '/uploads/1773717225831-30114298.png', 'erlang.com', 5, 1),
(6, 'sport england', '/uploads/1773717260723-678942239.png', 'sportengland.com', 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `addproduct`
--

CREATE TABLE `addproduct` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `productname` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `displayorder` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addproduct`
--

INSERT INTO `addproduct` (`id`, `category_id`, `brand_id`, `productname`, `description`, `image`, `price`, `displayorder`, `status`) VALUES
(1, 0, 0, 'Black Dress', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ', '/uploads/1769229047038-91895841.jpg', 14.00, 1, 1),
(2, 0, 0, 'White blue dress', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ', '/uploads/1769227522760-8556127.jpg', 67.00, 2, 1),
(3, 0, 0, 'Long blue dress', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ', '/uploads/1769227561946-933317939.jpg', 10.00, 3, 1),
(4, 0, 0, 'Wine top', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ', '/uploads/1769227582354-35669195.jpg', 22.00, 4, 1),
(5, 0, 0, 'Blue jean', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. \r\n', '/uploads/1769227623329-831015015.jpg', 22.00, 5, 1),
(6, 0, 0, 'Jeans combo', 'ewdw whegd wdw ffwaLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \r\n', '/uploads/1769227648180-789351713.jpg', 21.00, 6, 1),
(7, 0, 0, 'Black coat', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.', '/uploads/1769227671764-591751878.jpg', 56.00, 8, 1),
(8, 0, 0, 'Black top', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  ', '/uploads/1769227701369-162173087.jpg', 56.00, 8, 1),
(9, 0, 0, 'Woolen cream top', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ', '/uploads/1769227754821-123122410.jpg', 67.00, 9, 1),
(10, 0, 0, 'white dress', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', '/uploads/1769227786305-519756758.jpg', 89.00, 10, 1),
(11, 0, 0, 'Women flat sandle', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ', '/uploads/1769228164379-366519902.png', 45.00, 11, 1),
(12, 1, 7, 'Women heels sandle', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.', '/uploads/1773858870385-964176779.png', 32.00, 12, 1),
(13, 5, 0, 'Cotton double bedsheet', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ', '/uploads/1769228235506-916945584.png', 23.00, 13, 1),
(14, 5, 0, 'Cotton super king', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ', '/uploads/1769228261517-945685104.png', 54.00, 14, 1),
(15, 5, 0, 'Lord shiva scenery', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. ', '/uploads/1769228432195-663293563.png', 65.00, 15, 1),
(16, 5, 0, 'Seven horse photo frame', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ', '/uploads/1769228455280-156530077.png', 11.00, 16, 1),
(17, 5, 0, 'Wall clock', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ', '/uploads/1769228666987-154393870.png', 22.00, 17, 1),
(18, 5, 0, 'Multicolor clock', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.', '/uploads/1769228693038-1679070.png', 12.00, 18, 1),
(36, 1, 0, 'Heels sandle', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ', '/uploads/1770146544054-374178403.jpg', 12.00, 19, 1),
(37, 6, 0, 'Accessories', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.', '/uploads/1770146662029-560123196.jpg', 44.00, 20, 1),
(38, 1, 1, 'Sports shoes', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. ', '/uploads/1773722416408-468966951.jpg', 2.00, 21, 1),
(39, 2, 1, 'Nike T-shirt', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', '/uploads/1776400326333-144389486.webp', 8.00, 39, 1);

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `userid`, `firstname`, `lastname`, `email`, `mobile`, `address`, `city`, `state`, `country`, `zip`) VALUES
(1, 4, 'Nisha Rani', '', '', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'ludhiana', 'Punjab', 'India', '141008'),
(2, 4, 'Nisha Rani', '', '', '0977 916 6265', '1081, Ext. Basant Vihar Noorwala Road ludhiana', 'ludhiana', 'Punjab', 'India', '141008'),
(3, 7, 'parvesh', 'singh', 'Parveshsingh2017@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'ludhiana', 'Punjab', 'India', '141008'),
(4, 7, 'parvesh', 'singh', 'Parveshsingh2017@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'ludhiana', 'Punjab', 'India', '141008'),
(5, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'ludhiana', 'Punjab', 'India', '141008'),
(6, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'ludhiana', 'Punjab', 'India', '141008');

-- --------------------------------------------------------

--
-- Table structure for table `addslider`
--

CREATE TABLE `addslider` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `displayorder` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addslider`
--

INSERT INTO `addslider` (`id`, `image`, `description`, `displayorder`, `status`) VALUES
(1, '/uploads/1768886778060-510463646.jpg', 'Upto 50% Sale on Winter', 1, 0),
(2, '/uploads/1768984639802-483210535.jpg', 'Hot Deals', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `adminlogin`
--

CREATE TABLE `adminlogin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adminlogin`
--

INSERT INTO `adminlogin` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `name`, `email`, `subject`, `message`) VALUES
(1, 'nisha', 'nisharaniofficial1@gmail.com', 'website development', 'This is the contact message');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter`
--

CREATE TABLE `newsletter` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newsletter`
--

INSERT INTO `newsletter` (`id`, `email`) VALUES
(1, 'nisha@gmail.com'),
(2, 'parvesh@gmail.com'),
(3, 'shallu@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  `productname` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`id`, `orderid`, `productid`, `productname`, `quantity`, `price`) VALUES
(1, 1, 37, 'shoes', 1, 44),
(2, 2, 17, 'Wall clock', 1, 22),
(3, 2, 18, 'Multicolor clock', 1, 12),
(4, 2, 36, 'Heels sandle', 1, 12),
(5, 2, 37, 'shoes', 1, 44),
(6, 3, 13, 'Cotton double bedsheet', 1, 23),
(7, 4, 36, 'Heels sandle', 1, 12),
(8, 5, 18, 'Multicolor clock', 1, 12),
(9, 6, 15, 'Lord shiva scenery', 1, 65),
(10, 6, 14, 'Cotton super king', 1, 54),
(11, 7, 36, 'Heels sandle', 1, 12),
(12, 7, 18, 'Multicolor clock', 1, 12),
(13, 8, 17, 'Wall clock', 1, 22),
(14, 9, 38, 'Sports shoes', 1, 2),
(15, 10, 37, 'shoes', 1, 44),
(16, 10, 38, 'Sports shoes', 1, 2),
(17, 11, 16, 'Seven horse photo frame', 1, 11),
(18, 11, 15, 'Lord shiva scenery', 1, 65),
(19, 12, 18, 'Multicolor clock', 1, 12),
(20, 13, 36, 'Heels sandle', 1, 12),
(21, 14, 36, 'Heels sandle', 1, 12);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zip` int(11) NOT NULL,
  `paymentmethod` varchar(255) NOT NULL,
  `subtotal` int(11) NOT NULL,
  `shipping` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `orderdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userid`, `firstname`, `lastname`, `email`, `mobile`, `address`, `country`, `city`, `state`, `zip`, `paymentmethod`, `subtotal`, `shipping`, `total`, `status`, `orderdate`) VALUES
(1, 5, 'shallu', 'sharma', 'shallu@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 44, 5, 49, '', '2026-03-19 20:20:57'),
(2, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 90, 5, 95, '', '2026-03-19 20:20:57'),
(3, 5, 'shallu', 'sharma', 'shallu@gmail.com', '9898989898', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 23, 5, 28, '', '2026-03-19 20:20:57'),
(4, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', '', 'ludhiana', 'Punjab', 141008, 'cod', 12, 5, 17, '', '2026-03-19 20:20:57'),
(5, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', '', 'ludhiana', 'Punjab', 141008, 'cod', 12, 5, 17, '', '2026-03-19 20:20:57'),
(6, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', '', 'ludhiana', 'Punjab', 141008, 'cod', 119, 5, 124, '', '2026-03-19 20:20:57'),
(7, 4, 'Nisha', 'Rani', 'nisharani2312@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 24, 5, 29, '', '2026-03-19 20:20:57'),
(8, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 22, 5, 27, '', '2026-03-19 20:20:57'),
(9, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 2, 5, 7, '', '2026-03-19 20:20:57'),
(10, 7, 'parvesh', 'singh', 'Parveshsingh2017@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 46, 5, 51, '', '2026-03-19 20:20:57'),
(11, 7, 'parvesh', 'singh', 'Parveshsingh2017@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 76, 5, 81, '', '2026-03-19 20:47:30'),
(12, 7, 'parvesh', 'singh', 'Parveshsingh2017@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 12, 5, 17, '', '2026-03-20 09:19:54'),
(13, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 12, 5, 17, '', '2026-03-20 10:13:48'),
(14, 3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', 'Ext. Basant Vihar Noorwala Road ludhiana', 'India', 'ludhiana', 'Punjab', 141008, 'cod', 12, 5, 17, '', '2026-04-17 09:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `productid`, `username`, `rating`, `comment`) VALUES
(1, 18, 'shallu', 4, 'This product is very nice and good quality.'),
(2, 18, 'Nisha2312', 5, 'Good product'),
(3, 18, 'Nisha2312', 2, 'hvghv\n'),
(4, 18, 'Nisha2312', 4, 'fkghvhgbjhbj jhj kjhjkk jkkjkljkjh'),
(5, 18, 'Nisha2312', 5, 'gfsga sahdaf adjas fashfash\n'),
(6, 18, 'Nisha2312', 2, 'fgdcfgc hghfvghv'),
(7, 12, 'Nisha2312', 3, 'very nice product');

-- --------------------------------------------------------

--
-- Table structure for table `userregister`
--

CREATE TABLE `userregister` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(500) NOT NULL,
  `reset_token_expire` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userregister`
--

INSERT INTO `userregister` (`id`, `firstname`, `lastname`, `email`, `mobile`, `password`, `reset_token`, `reset_token_expire`) VALUES
(1, 'ritu', 'sharma', 'ritu@gmail.com', '2147483647', '$2b$10$4hGa1J9YXfSatWzIpDK8AO6RhHlcp2x.UxiekV.ViUIrRwuE3MRMu', '', 0),
(2, 'pn', 'thakur', 'pn@gmail.com', '2147483647', '$2b$10$60Tjw1zHLneVkem1wYKu/uI00JMf0KKYQsGafU1YVDUg1ZNdmI8Ky', '', 0),
(3, 'Nisha', 'Rani', 'nisharaniofficial1@gmail.com', '0977 916 6265', '12345678', '', 0),
(4, 'Nisha2312', 'Rani', 'nisharani2312@gmail.com', '9898988999', '12345678', '', 0),
(5, 'shallu', 'prasher', 'shallu99@gmail.com', '0977 916 6265', '12345678', '', 0),
(7, 'parvesh', 'singh', 'Parveshsingh2017@gmail.com', '0977 916 6265', '12345678', '', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addbrand`
--
ALTER TABLE `addbrand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addcategory`
--
ALTER TABLE `addcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addpage`
--
ALTER TABLE `addpage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addpartner`
--
ALTER TABLE `addpartner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addproduct`
--
ALTER TABLE `addproduct`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addslider`
--
ALTER TABLE `addslider`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adminlogin`
--
ALTER TABLE `adminlogin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userregister`
--
ALTER TABLE `userregister`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addbrand`
--
ALTER TABLE `addbrand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `addcategory`
--
ALTER TABLE `addcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `addpage`
--
ALTER TABLE `addpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `addpartner`
--
ALTER TABLE `addpartner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `addproduct`
--
ALTER TABLE `addproduct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `addslider`
--
ALTER TABLE `addslider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `adminlogin`
--
ALTER TABLE `adminlogin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `userregister`
--
ALTER TABLE `userregister`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
