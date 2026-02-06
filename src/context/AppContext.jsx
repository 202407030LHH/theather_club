import React, { createContext, useState, useEffect, useContext } from 'react';
import { USER_ROLES, DEFAULT_ROLE } from '../constants/roles';
import { authAPI, postsAPI, uploadAPI } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('theater_current_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);

    // 초기 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersData, postsData] = await Promise.all([
                    authAPI.getUsers(),
                    postsAPI.getAll()
                ]);
                setUsers(usersData);
                setPosts(postsData);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 현재 사용자 저장
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('theater_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('theater_current_user');
        }
    }, [currentUser]);

    // ============ 인증 함수 ============

    const signUp = async (userData) => {
        await authAPI.signUp(userData);
        // 사용자 목록 새로고침
        const updatedUsers = await authAPI.getUsers();
        setUsers(updatedUsers);
    };

    const login = async (id, password) => {
        const { user } = await authAPI.login(id, password);
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    // ============ 게시물 함수 ============

    const createPost = async (postData) => {
        const newPost = await postsAPI.create({
            author_id: currentUser.id,
            author_name: currentUser.name,
            ...postData
        });

        // 게시물 목록 새로고침
        const updatedPosts = await postsAPI.getAll();
        setPosts(updatedPosts);

        return newPost;
    };

    const toggleLike = async (postId) => {
        await postsAPI.like(postId);
        // 게시물 목록 새로고침
        const updatedPosts = await postsAPI.getAll();
        setPosts(updatedPosts);
    };

    const addComment = async (postId, commentText) => {
        await postsAPI.addComment(postId, {
            author_id: currentUser.id,
            author_name: currentUser.name,
            text: commentText
        });
        // 게시물 목록 새로고침
        const updatedPosts = await postsAPI.getAll();
        setPosts(updatedPosts);
    };

    // ============ 파일 업로드 함수 ============

    const uploadImage = async (file) => {
        const result = await uploadAPI.image(file);
        return result.url;
    };

    const uploadFile = async (file) => {
        const result = await uploadAPI.file(file);
        return result;
    };

    // ============ 관리자 함수 ============

    const updateUserRole = async (targetUserId, newRoleKey) => {
        await authAPI.updateRole(targetUserId, newRoleKey);
        // 사용자 목록 새로고침
        const updatedUsers = await authAPI.getUsers();
        setUsers(updatedUsers);
    };

    const value = {
        users,
        posts,
        currentUser,
        loading,
        signUp,
        login,
        logout,
        createPost,
        addComment,
        toggleLike,
        uploadImage,
        uploadFile,
        updateUserRole,
        USER_ROLES
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
