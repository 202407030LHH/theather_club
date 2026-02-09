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

/* 
  GET /api/notices
  공지사항 목록 조회
*/
router.get('/', (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            console.error('Database connection failed');
            return res.status(500).json({ error: 'Database not initialized' });
        }

        // 작성자 이름을 가져오기 위해 조인 사용
        const query = `
      SELECT notices.*, users.name as author_name 
      FROM notices 
      LEFT JOIN users ON notices.author_id = users.id 
      ORDER BY notices.created_at DESC
    `;
        const result = db.exec(query);
        const notices = toObjects(result);
        res.json(notices);
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

/*
  POST /api/notices
  공지사항 작성
*/
router.post('/', (req, res) => {
    try {
        const { title, content, author_id, is_hidden } = req.body;
        console.log('Creating notice:', { title, author_id, is_hidden });

        const db = getDb();
        if (!db) {
            console.error('Database connection failed');
            return res.status(500).json({ error: 'Database not initialized' });
        }

        // is_hidden은 0 또는 1
        const hiddenVal = is_hidden ? 1 : 0;

        // 파라미터 바인딩 사용 (안전하게 처리)
        const stmt = db.prepare(`
      INSERT INTO notices (title, content, author_id, is_hidden) 
      VALUES ($title, $content, $author_id, $is_hidden)
    `);

        stmt.run({
            $title: title,
            $content: content,
            $author_id: author_id,
            $is_hidden: hiddenVal
        });
        stmt.free(); // 메모리 해제

        saveDatabase();

        // 방금 생성된 ID 가져오기
        const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
        let newId = null;
        if (lastIdResult && lastIdResult[0] && lastIdResult[0].values && lastIdResult[0].values[0]) {
            newId = lastIdResult[0].values[0][0];
        }

        console.log('New notice ID:', newId);

        if (!newId) {
            throw new Error('Failed to retrieve new notice ID');
        }

        // 생성된 글 조회해서 반환
        const newNoticeResult = db.exec(`
      SELECT notices.*, users.name as author_name 
      FROM notices 
      LEFT JOIN users ON notices.author_id = users.id 
      WHERE notices.id = ${newId}
    `);

        const notices = toObjects(newNoticeResult);
        let newNotice = notices.length > 0 ? notices[0] : null;

        if (!newNotice) {
            console.warn('Could not fetch new notice details, returning basic info');
            newNotice = { id: newId, title, content, author_id, is_hidden: hiddenVal, created_at: new Date().toISOString() };
        }

        console.log('Notice created successfully:', newNotice.id);
        res.status(201).json(newNotice);
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

/*
  DELETE /api/notices/:id
  공지사항 삭제
*/
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        db.run(`DELETE FROM notices WHERE id = ${id}`);
        saveDatabase();

        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;
