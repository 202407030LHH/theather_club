const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 API (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// 프론트엔드 정적 파일 서빙 (배포 시 사용)
const frontendBuildPath = path.join(__dirname, '../dist');

if (fs.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));

    // SPA 라우팅 지원 - API가 아닌 모든 요청을 index.html로
    app.get('*', (req, res) => {
        if (req.url.startsWith('/api') || req.url.startsWith('/uploads')) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    // 개발 환경 (프론트엔드 서버가 따로 돌 때)
    app.get('/', (req, res) => {
        res.json({ message: 'Theater Club API Server (SQLite)' });
    });
}

// 서버 시작 (비동기)
const startServer = async () => {
    // DB 초기화
    await initDatabase();

    app.listen(PORT, () => {
        console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
};

startServer();
