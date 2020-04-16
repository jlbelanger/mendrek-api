CREATE DATABASE IF NOT EXISTS `mendrek`;
CREATE DATABASE IF NOT EXISTS `mendrek_test`;
CREATE USER IF NOT EXISTS 'mendrek'@'%' IDENTIFIED BY 'mendrek';
GRANT ALL PRIVILEGES ON mendrek.* TO 'mendrek'@'%';
GRANT ALL PRIVILEGES ON mendrek_test.* TO 'mendrek'@'%';
