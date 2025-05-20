CREATE DATABASE IF NOT EXISTS `db_mendrek`;
CREATE DATABASE IF NOT EXISTS `db_mendrek_test`;
CREATE USER IF NOT EXISTS 'db_mendrek'@'%' IDENTIFIED BY 'db_mendrek';
GRANT ALL PRIVILEGES ON db_mendrek.* TO 'db_mendrek'@'%';
GRANT ALL PRIVILEGES ON db_mendrek_test.* TO 'db_mendrek'@'%';
