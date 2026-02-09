import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { noticesAPI } from '../services/api';
import { Trash2, PenTool, Eye, EyeOff } from 'lucide-react';
import '../styles/feed.css';

const Notices = () => {
    const { currentUser } = useAppContext();
    const [notices, setNotices] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [loading, setLoading] = useState(true);

    // 폼 데이터
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        is_hidden: false // 기본값: 공개
    });

    const isAdmin = currentUser?.role === 'ADMIN';

    // 공지사항 불러오기
    const fetchNotices = async () => {
        try {
            setLoading(true);
            const data = await noticesAPI.getAll();
            setNotices(data);
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 라디오 버튼 핸들러 (공개/비공개)
    const handleVisibilityChange = (e) => {
        setFormData(prev => ({
            ...prev,
            is_hidden: e.target.value === 'hidden'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        try {
            await noticesAPI.create({
                ...formData,
                author_id: currentUser.id
            });
            setIsWriting(false);
            setFormData({ title: '', content: '', is_hidden: false });
            fetchNotices(); // 목록 갱신
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        try {
            await noticesAPI.delete(id);
            fetchNotices();
        } catch (error) {
            alert(error.message);
        }
    };

    // 필터링: 관리자는 모두 보고, 일반 사용자는 공개된 것만 봄
    const visibleNotices = notices.filter(notice => isAdmin || !notice.is_hidden);

    return (
        <div className="feed-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>📢 Notices</h2>
                    <p>Important announcements for club members.</p>
                </div>
                {isAdmin && !isWriting && (
                    <button
                        className="primary-btn"
                        onClick={() => setIsWriting(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <PenTool size={16} />
                        New Notice
                    </button>
                )}
            </div>

            {/* 작성 폼 (관리자 전용) */}
            {isWriting && isAdmin && (
                <div className="post-card" style={{ marginTop: '1.5rem', border: '2px solid var(--primary-color)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Write New Notice</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="form-input"
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                className="form-input"
                                rows={5}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Visibility</label>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="visible"
                                        checked={!formData.is_hidden}
                                        onChange={handleVisibilityChange}
                                    />
                                    <span>Visible (All Members)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="hidden"
                                        checked={formData.is_hidden}
                                        onChange={handleVisibilityChange}
                                    />
                                    <span style={{ color: 'gray' }}>Hidden (Draft / Admin Only)</span>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => setIsWriting(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="primary-btn">
                                Post Notice
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading notices...</div>
            ) : (
                <div className="notices-list" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {visibleNotices.length === 0 ? (
                        <div className="empty-state">No notices yet.</div>
                    ) : (
                        visibleNotices.map(notice => (
                            <div key={notice.id} className="post-card" style={{
                                borderLeft: `4px solid ${notice.is_hidden ? '#ccc' : '#800020'}`,
                                opacity: notice.is_hidden ? 0.8 : 1
                            }}>
                                <div className="post-header" style={{ marginBottom: '0.5rem' }}>
                                    <div className="author-info" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {notice.title}
                                                    {notice.is_hidden && (
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            backgroundColor: '#eee',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            color: '#666',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            <EyeOff size={12} /> Hidden
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="post-time">
                                                    {new Date(notice.created_at).toLocaleDateString()} • {notice.author_name || 'Admin'}
                                                </div>
                                            </div>

                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(notice.id)}
                                                    className="icon-btn danger"
                                                    title="Delete Notice"
                                                    style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="post-content">
                                    <p className="post-text" style={{ whiteSpace: 'pre-line' }}>{notice.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notices;
