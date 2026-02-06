const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// uploads 폴더 생성
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer 설정 - 이미지용
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imagesDir = path.join(uploadsDir, 'images');
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Multer 설정 - 파일용
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filesDir = path.join(uploadsDir, 'files');
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir, { recursive: true });
        }
        cb(null, filesDir);
    },
    filename: (req, file, cb) => {
        // 한글 파일명 처리
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const uniqueName = `${Date.now()}-${originalName}`;
        cb(null, uniqueName);
    }
});

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

const uploadFile = multer({
    storage: fileStorage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// 이미지 업로드
router.post('/image', uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const imageUrl = `/uploads/images/${req.file.filename}`;
        res.json({
            url: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// 파일 업로드
router.post('/file', uploadFile.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = `/uploads/files/${req.file.filename}`;
        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

        res.json({
            path: filePath,
            name: originalName,
            size: req.file.size
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// 다중 파일 업로드
router.post('/files', uploadFile.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => {
            const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            return {
                path: `/uploads/files/${file.filename}`,
                name: originalName,
                size: file.size
            };
        });

        res.json(uploadedFiles);
    } catch (error) {
        console.error('Files upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

module.exports = router;
