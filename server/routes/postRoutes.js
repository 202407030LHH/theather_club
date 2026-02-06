const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// 게시물 목록 조회
router.get('/', async (req, res) => {
    try {
        const [posts] = await pool.query(
            'SELECT * FROM posts ORDER BY created_at DESC'
        );

        // 각 게시물에 댓글과 첨부파일 추가
        for (let post of posts) {
            const [comments] = await pool.query(
                'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
                [post.id]
            );
            const [attachments] = await pool.query(
                'SELECT * FROM attachments WHERE post_id = ?',
                [post.id]
            );
            post.comments = comments;
            post.attachments = attachments;
        }

        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 게시물 작성
router.post('/', async (req, res) => {
    try {
        const { author_id, author_name, title, content, image_url, attachments } = req.body;

        const [result] = await pool.query(
            'INSERT INTO posts (author_id, author_name, title, content, image_url) VALUES (?, ?, ?, ?, ?)',
            [author_id, author_name, title || null, content, image_url || null]
        );

        const postId = result.insertId;

        // 첨부파일 저장
        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                await pool.query(
                    'INSERT INTO attachments (post_id, file_name, file_path) VALUES (?, ?, ?)',
                    [postId, att.name, att.path || '']
                );
            }
        }

        // 생성된 게시물 반환
        const [newPost] = await pool.query('SELECT * FROM posts WHERE id = ?', [postId]);
        res.status(201).json(newPost[0]);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 좋아요
router.post('/:id/like', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id]);

        const [post] = await pool.query('SELECT likes FROM posts WHERE id = ?', [id]);
        res.json({ likes: post[0].likes });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 댓글 목록 조회
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;

        const [comments] = await pool.query(
            'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
            [id]
        );

        res.json(comments);
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 댓글 작성
router.post('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { author_id, author_name, text } = req.body;

        const [result] = await pool.query(
            'INSERT INTO comments (post_id, author_id, author_name, text) VALUES (?, ?, ?, ?)',
            [id, author_id, author_name, text]
        );

        const [newComment] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
        res.status(201).json(newComment[0]);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 게시물 삭제
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
