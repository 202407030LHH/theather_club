import React, { createContext, useState, useEffect, useContext } from 'react';
import { USER_ROLES, DEFAULT_ROLE } from '../constants/roles';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // --- State Initialization ---
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('theater_users');
        return saved ? JSON.parse(saved) : [];
    });

    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('theater_posts');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                authorId: 'admin',
                authorName: "Director Lee",
                time: "2024-02-10T10:00:00.000Z", // ISO string for sorting
                title: "NOTICE: Regular Practice Schedule Change",
                content: "Hi everyone, due to the main hall maintenance, our regular practice this Tuesday will be moved to Theater B. Time remains the same (7 PM). Please be on time!",
                attachments: [{ name: "Updated_Schedule.pdf" }]
            },
            {
                id: 2,
                authorId: 'sarah',
                authorName: "Sarah Kim",
                time: "2024-02-10T07:00:00.000Z",
                content: "Check out the photos from last week's improv session! Everyone did so great.",
                image: "https://images.unsplash.com/photo-1503095392237-7362137d7a6e?auto=format&fit=crop&q=80&w=1000"
            }
        ];
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('theater_current_user');
        return saved ? JSON.parse(saved) : null;
    });

    // --- Effects for Persistence ---
    useEffect(() => {
        localStorage.setItem('theater_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('theater_posts', JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('theater_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('theater_current_user');
        }
    }, [currentUser]);

    // --- Actions ---

    const signUp = (userData) => { // { id, password, name }
        if (users.find(u => u.id === userData.id)) {
            throw new Error("ID already exists");
        }
        const newUser = {
            ...userData,
            role: DEFAULT_ROLE,
            joinedAt: new Date().toISOString()
        };
        setUsers([...users, newUser]);
        return newUser;
    };

    const login = (id, password) => {
        const user = users.find(u => u.id === id && u.password === password);
        if (!user) {
            // Special case for initial admin if no users exist or admin checking
            if (id === 'admin' && password === 'admin') {
                // Create admin user if not exists
                const adminUser = { id: 'admin', name: 'Admin', role: 'ADMIN', joinedAt: new Date().toISOString() };
                if (!users.find(u => u.id === 'admin')) {
                    setUsers([...users, adminUser]);
                }
                setCurrentUser(adminUser);
                return adminUser;
            }
            throw new Error("Invalid ID or Password");
        }
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const createPost = (postData) => { // { title, content, image }
        const newPost = {
            id: Date.now(),
            authorId: currentUser.id,
            authorName: currentUser.name,
            time: new Date().toISOString(),
            ...postData
        };
        setPosts([newPost, ...posts]);
    };

    const updateUserRole = (targetUserId, newRoleKey) => {
        setUsers(users.map(u =>
            u.id === targetUserId ? { ...u, role: newRoleKey } : u
        ));
    };

    const value = {
        users,
        posts,
        currentUser,
        signUp,
        login,
        logout,
        createPost,
        updateUserRole,
        USER_ROLES
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
