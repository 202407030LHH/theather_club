-- Theater Club Database Schema
-- MySQL 데이터베이스 생성 및 테이블 정의

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS theater_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE theater_club;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'GUEST',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 게시물 테이블
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    image_url VARCHAR(500),
    likes INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 첨부파일 테이블
CREATE TABLE IF NOT EXISTS attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 초기 관리자 계정 생성
INSERT INTO users (id, name, password, role) 
VALUES ('admin', 'Admin', 'admin', 'ADMIN')
ON DUPLICATE KEY UPDATE id = id;
