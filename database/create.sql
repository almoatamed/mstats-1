DROP DATABASE IF EXISTS `pharma`;
CREATE DATABASE IF NOT EXISTS `pharma`;

USE `pharma`;

CREATE TABLE IF NOT EXISTS`user` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `email` varchar(255),
  `phone_number` varchar(20),
  `address` varchar(255),
  `user_name` varchar(255),
  `password` varchar(255)
);

CREATE TABLE IF NOT EXISTS`files` (
  `file_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100),
  `type` varchar(100),
  `size` int,
  `path` varchar(255),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`pharmacies` (
  `pharmacy_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `address` varchar(255),
  `phone` varchar(20),
  `email` varchar(255),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`hospitals` (
  `hospital_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `address` varchar(255),
  `phone` varchar(20),
  `email` varchar(255),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS `doctors` (
  `doctor_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `address` varchar(255),
  `phone` varchar(20),
  `email` varchar(255),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`medical_representative` (
  `representative_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `address` varchar(255),
  `phone` varchar(20),
  `email` varchar(255),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`manufacturers` (
  `manufacturer_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `address` varchar(255),
  `phone` varchar(20),
  `email` varchar(255),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`products` (
  `product_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `link` varchar(255),
  `manufacturer_id` INT,
  `image_id` int DEFAULT null,
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`prescriptions` (
  `prescription_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100),
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`doctor_prescriptions` (
  `sheet_id` INT PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` INT,
  `prescription_id` INT,
  `status` INT,
  `pharmacy_id` INT,
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`doctor_hospital_relations` (
  `relation_id` INT PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` INT,
  `hospital_id` INT,
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`pharmacy_hospital_relations` (
  `relation_id` INT PRIMARY KEY AUTO_INCREMENT,
  `pharmacy_id` INT,
  `hospital_id` INT,
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`doctor_medical_representative_relations` (
  `relation_id` INT PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` INT,
  `representative_id` INT,
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

CREATE TABLE IF NOT EXISTS`prescription_product_relations` (
  `relation_id` INT PRIMARY KEY AUTO_INCREMENT,
  `prescription_id` INT,
  `product_id` INT,
  `created_at` timestamp DEFAULT current_timestamp,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` INT DEFAULT 0,
  `create_by_user` INT
);

-- ALTER TABLE `pharmacies` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `hospitals` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `doctors` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `medical_representative` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `manufacturers` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `products` ADD FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`manufacturer_id`);

-- ALTER TABLE `products` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `prescriptions` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `doctor_prescriptions` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

-- ALTER TABLE `doctor_prescriptions` ADD FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`prescription_id`);

-- ALTER TABLE `doctor_prescriptions` ADD FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`pharmacy_id`);

-- ALTER TABLE `doctor_prescriptions` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `doctor_hospital_relations` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

-- ALTER TABLE `doctor_hospital_relations` ADD FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`);

-- ALTER TABLE `doctor_hospital_relations` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `pharmacy_hospital_relations` ADD FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`pharmacy_id`);

-- ALTER TABLE `pharmacy_hospital_relations` ADD FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`hospital_id`);

-- ALTER TABLE `pharmacy_hospital_relations` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `doctor_medical_representative_relations` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

-- ALTER TABLE `doctor_medical_representative_relations` ADD FOREIGN KEY (`representative_id`) REFERENCES `medical_representative` (`representative_id`);

-- ALTER TABLE `doctor_medical_representative_relations` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);

-- ALTER TABLE `prescription_product_relations` ADD FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`prescription_id`);

-- ALTER TABLE `prescription_product_relations` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

-- ALTER TABLE `prescription_product_relations` ADD FOREIGN KEY (`create_by_user`) REFERENCES `user` (`user_id`);
