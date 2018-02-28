SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database: `library_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_tbl`
--

CREATE TABLE `admin_tbl` (
  `S.No.` int(11) NOT NULL,
  `Admin password` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin_tbl`
--

INSERT INTO `admin_tbl` (`S.No.`, `Admin password`) VALUES
(1, '$2a$10$oUQA8vrYZGM0lv3FrWFf5ut2lWto6FMn0cfBGZMxLzSpaH0LtPasa');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_tbl`
--

CREATE TABLE `feedback_tbl` (
  `S.No.` int(11) NOT NULL,
  `Student Id` varchar(1000) NOT NULL,
  `Feedback` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `lbbook_tbl`
--

CREATE TABLE `lbbook_tbl` (
  `S.No.` int(11) NOT NULL,
  `Book Name` varchar(1000) NOT NULL,
  `Writers` varchar(1000) NOT NULL,
  `Publication` varchar(1000) NOT NULL,
  `RFID tag` varchar(1000) NOT NULL,
  `Shelf No.` int(11) NOT NULL,
  `Row No.` int(11) NOT NULL,
  `Column No.` int(11) NOT NULL,
  `Status` varchar(1000) NOT NULL DEFAULT 'Available',
  `Total Available Number` int(11) NOT NULL,
  `Available Number on Shelf` int(11) NOT NULL,
  `Available Number on Desk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `request_tbl`
--

CREATE TABLE `request_tbl` (
  `S.No.` int(11) NOT NULL,
  `Book Name` varchar(10000) NOT NULL,
  `Writers` mediumtext NOT NULL,
  `Publication` mediumtext NOT NULL,
  `Student Id` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `student_tbl`
--

CREATE TABLE `student_tbl` (
  `S.No.` int(11) NOT NULL,
  `Name` varchar(1000) NOT NULL,
  `Uid` int(4) NOT NULL,
  `Username` varchar(1000) NOT NULL,
  `Password` varchar(1000) NOT NULL,
  `Book Table` varchar(1000) NOT NULL,
  `Fine amount` int(11) NOT NULL,
  `Account amount` int(4) NOT NULL,
  `Father's Name` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_tbl`
--
ALTER TABLE `admin_tbl`
  ADD PRIMARY KEY (`S.No.`);

--
-- Indexes for table `feedback_tbl`
--
ALTER TABLE `feedback_tbl`
  ADD PRIMARY KEY (`S.No.`);

--
-- Indexes for table `lbbook_tbl`
--
ALTER TABLE `lbbook_tbl`
  ADD PRIMARY KEY (`S.No.`);

--
-- Indexes for table `request_tbl`
--
ALTER TABLE `request_tbl`
  ADD PRIMARY KEY (`S.No.`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `student_tbl`
--
ALTER TABLE `student_tbl`
  ADD PRIMARY KEY (`S.No.`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_tbl`
--
ALTER TABLE `admin_tbl`
  MODIFY `S.No.` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedback_tbl`
--
ALTER TABLE `feedback_tbl`
  MODIFY `S.No.` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lbbook_tbl`
--
ALTER TABLE `lbbook_tbl`
  MODIFY `S.No.` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `request_tbl`
--
ALTER TABLE `request_tbl`
  MODIFY `S.No.` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_tbl`
--
ALTER TABLE `student_tbl`
  MODIFY `S.No.` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
