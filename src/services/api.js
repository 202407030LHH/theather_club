// API 서버 기본 URL
const API_BASE_URL = 'http://localhost:5000/api';

// 공통 fetch 함수
const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    return response.json();
};

// ============ Auth API ============

export const authAPI = {
    // 회원가입
    signUp: (userData) =>
        fetchAPI('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),

    // 로그인
    login: (id, password) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ id, password })
        }),

    // 전체 사용자 목록
    getUsers: () =>
        fetchAPI('/auth/users'),

    // 등급 변경
    updateRole: (userId, role) =>
        fetchAPI(`/auth/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        }),
};

// ============ Posts API ============

export const postsAPI = {
    // 게시물 목록
    getAll: () =>
        fetchAPI('/posts'),

    // 게시물 작성
    create: (postData) =>
        fetchAPI('/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        }),

    // 좋아요
    like: (postId) =>
        fetchAPI(`/posts/${postId}/like`, { method: 'POST' }),

    // 댓글 작성
    addComment: (postId, commentData) =>
        fetchAPI(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData)
        }),

    // 게시물 삭제
    delete: (postId) =>
        fetchAPI(`/posts/${postId}`, { method: 'DELETE' }),
};

// ============ Upload API ============

export const uploadAPI = {
    // 이미지 업로드
    image: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        return response.json();
    },

    // 파일 업로드
    file: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload/file`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('File upload failed');
        }

        return response.json();
    },

    // 다중 파일 업로드
    files: async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`${API_BASE_URL}/upload/files`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Files upload failed');
        }

        return response.json();
    },
};

// ============ Notices API ============

export const noticesAPI = {
    // 공지사항 목록
    getAll: () =>
        fetchAPI('/notices'),

    // 공지사항 작성
    create: (noticeData) =>
        fetchAPI('/notices', {
            method: 'POST',
            body: JSON.stringify(noticeData)
        }),

    // 공지사항 삭제
    delete: (id) =>
        fetchAPI(`/notices/${id}`, { method: 'DELETE' }),
};

// 서버 이미지 URL 생성 헬퍼
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
};
