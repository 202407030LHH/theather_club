const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../config/db');

// 결과를 객체 배열로 변환하는 헬퍼 함수
const toObjects = (result) => {
    if (!result || result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => {
            obj[col] = row[i];
        });
        return obj;
    });
};

// 게시물 목록 조회
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const postsResult = db.exec('SELECT * FROM posts ORDER BY created_at DESC');
        const posts = toObjects(postsResult);

        // 각 게시물에 댓글과 첨부파일 추가
        for (let post of posts) {
            const commentsResult = db.exec(`SELECT * FROM comments WHERE post_id = ${post.id} ORDER BY created_at ASC`);
            post.comments = toObjects(commentsResult);

            const attachmentsResult = db.exec(`SELECT * FROM attachments WHERE post_id = ${post.id}`);
            post.attachments = toObjects(attachmentsResult);
        }

        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 게시물 작성
router.post('/', (req, res) => {
    try {
        const { author_id, author_name, title, content, image_url, attachments } = req.body;
        const db = getDb();

        const titleVal = title ? `'${title}'` : 'NULL';
        const imageVal = image_url ? `'${image_url}'` : 'NULL';

        db.run(`INSERT INTO posts (author_id, author_name, title, content, image_url) VALUES ('${author_id}', '${author_name}', ${titleVal}, '${content}', ${imageVal})`);

        // 마지막 삽입된 ID 가져오기
        const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
        const postId = lastIdResult[0].values[0][0];

        // 첨부파일 저장
        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                db.run(`INSERT INTO attachments (post_id, file_name, file_path) VALUES (${postId}, '${att.name}', '${att.path || ''}')`);
            }
        }

        saveDatabase();

        // 생성된 게시물 반환
        const newPostResult = db.exec(`SELECT * FROM posts WHERE id = ${postId}`);
        const newPost = toObjects(newPostResult)[0];
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 좋아요
router.post('/:id/like', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        db.run(`UPDATE posts SET likes = likes + 1 WHERE id = ${id}`);
        saveDatabase();

        const result = db.exec(`SELECT likes FROM posts WHERE id = ${id}`);
        const likes = result[0].values[0][0];
        res.json({ likes });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 댓글 작성
router.post('/:id/comments', (req, res) => {
    try {
        const { id } = req.params;
        const { author_id, author_name, text } = req.body;
        const db = getDb();

        db.run(`INSERT INTO comments (post_id, author_id, author_name, text) VALUES (${id}, '${author_id}', '${author_name}', '${text}')`);

        const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
        const commentId = lastIdResult[0].values[0][0];

        saveDatabase();

        const newCommentResult = db.exec(`SELECT * FROM comments WHERE id = ${commentId}`);
        const newComment = toObjects(newCommentResult)[0];
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 게시물 삭제
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        db.run(`DELETE FROM attachments WHERE post_id = ${id}`);
        db.run(`DELETE FROM comments WHERE post_id = ${id}`);
        db.run(`DELETE FROM posts WHERE id = ${id}`);
        saveDatabase();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
