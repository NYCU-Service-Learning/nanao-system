CREATE DATABASE IF NOT EXISTS nanao_db;
CREATE USER IF NOT EXISTS 'nanao_user'@'%' IDENTIFIED BY 'nanao_password';
GRANT ALL PRIVILEGES ON nanao_db.* TO 'nanao_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'nanao_user'@'%';
FLUSH PRIVILEGES;
