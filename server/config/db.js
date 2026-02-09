const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '../database.db');

let db = null;

// 데이터베이스 초기화
const initDatabase = async () => {
    const SQL = await initSqlJs();

    // 기존 DB 파일이 있으면 로드, 없으면 새로 생성
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
        console.log('✅ 기존 데이터베이스 로드됨');
    } else {
        db = new SQL.Database();
        console.log('✅ 새 데이터베이스 생성됨');
    }

    // 테이블 생성
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'GUEST',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      title TEXT,
      content TEXT,
      image_url TEXT,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // 초기 관리자 계정 생성 (없으면)
    const adminCheck = db.exec("SELECT id FROM users WHERE id = 'admin'");
    if (adminCheck.length === 0 || adminCheck[0].values.length === 0) {
        db.run("INSERT INTO users (id, name, password, role) VALUES ('admin', 'Admin', 'admin', 'ADMIN')");
        console.log('✅ 관리자 계정 생성됨 (admin/admin)');
    }

    // 변경사항 저장
    saveDatabase();
    console.log('✅ SQLite 데이터베이스 초기화 완료!');
};

// 데이터베이스 저장
const saveDatabase = () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
};

// DB 인스턴스 가져오기
const getDb = () => db;

module.exports = { initDatabase, getDb, saveDatabase };
