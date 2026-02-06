const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { id, password, name } = req.body;

        // 중복 확인
        const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'ID already exists' });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        await pool.query(
            'INSERT INTO users (id, name, password, role) VALUES (?, ?, ?, ?)',
            [id, name, hashedPassword, 'GUEST']
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { id, password } = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid ID or Password' });
        }

        const user = users[0];

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // admin 계정 특별 처리 (초기 비암호화 비밀번호)
            if (id === 'admin' && password === 'admin') {
                const { password: _, ...userWithoutPassword } = user;
                return res.json({ user: userWithoutPassword });
            }
            return res.status(401).json({ error: 'Invalid ID or Password' });
        }

        // 비밀번호 제외하고 반환
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 전체 사용자 목록 (관리자용)
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, role, joined_at FROM users ORDER BY joined_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 사용자 등급 변경
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
