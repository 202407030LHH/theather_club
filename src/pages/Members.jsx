import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/feed.css';

const Members = () => {
    const { users } = useAppContext();

    // 회원 목록 (가져온 데이터)
    return (
        <div className="feed-container">
            <div className="page-header">
                <h2>👥 Members</h2>
                <p>Welcome to our theater family ({users.length} members)</p>
            </div>

            <div className="members-grid" style={{
                marginTop: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1rem'
            }}>
                {users.map(user => (
                    <div key={user.id} className="member-card" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: '1px solid #eee'
                    }}>
                        <div className="member-avatar-lg" style={{
                            width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `hsl(${user.name.length * 40}, 60%, 50%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}>
                            {user.name ? user.name[0] : '?'}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: '#333' }}>{user.name}</h3>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>@{user.id}</p>

                        <div className="member-role" style={{
                            marginTop: '0.8rem',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backgroundColor: user.role === 'ADMIN' ? '#e6f7ff' : '#f9f9f9',
                            color: user.role === 'ADMIN' ? '#1890ff' : '#666',
                            fontSize: '0.8rem', fontWeight: '500'
                        }}>
                            {user.role}
                        </div>
                        <p style={{ marginTop: '0.8rem', color: '#aaa', fontSize: '0.75rem' }}>
                            Joined {new Date(user.joined_at || user.joinedAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Members;
