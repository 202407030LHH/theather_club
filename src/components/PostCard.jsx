import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getImageUrl } from '../services/api';
import '../styles/feed.css';

const PostCard = ({ id, author_name, created_at, title, content, image_url, attachments = [], comments = [], likes = 0 }) => {
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { currentUser, addComment, toggleLike } = useAppContext();

    const handleLike = async () => {
        if (!liked && currentUser) {
            await toggleLike(id);
            setLiked(true);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;
        await addComment(id, commentText);
        setCommentText('');
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = (now - date) / 1000;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    // 작성자 이름 첫 글자 (안전하게 처리)
    const authorInitial = author_name ? author_name[0] : '?';

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="author-info">
                    <div className="author-avatar">{authorInitial}</div>
                    <div>
                        <div className="author-name">{author_name}</div>
                        <div className="post-time">{formatTime(created_at)}</div>
                    </div>
                </div>
                <button className="more-btn">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="post-content">
                {title && <h3 className="post-title">{title}</h3>}
                <p className="post-text">{content}</p>

                {image_url && (
                    <div className="post-image">
                        <img src={getImageUrl(image_url)} alt="Post content" />
                    </div>
                )}

                {attachments && attachments.length > 0 && (
                    <div className="post-attachments">
                        {attachments.map((att, idx) => (
                            <a
                                key={att.id || idx}
                                href={getImageUrl(att.file_path || att.path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="attachment-item"
                            >
                                <span>📎 {att.file_name || att.name}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <div className="post-stats">
                {likes > 0 && <span className="likes-count">❤️ {likes}</span>}
                {comments.length > 0 && (
                    <span className="comments-count" onClick={() => setShowComments(!showComments)}>
                        {comments.length} comment{comments.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="post-actions">
                <button
                    className={`action-btn ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    disabled={!currentUser}
                >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                    <span>Like</span>
                </button>
                <button
                    className="action-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle size={20} />
                    <span>Comment</span>
                </button>
                <button className="action-btn">
                    <Share2 size={20} />
                    <span>Share</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    {comments.length > 0 && (
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-avatar">
                                        {comment.author_name ? comment.author_name[0] : '?'}
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-author">{comment.author_name}</div>
                                        <div className="comment-text">{comment.text}</div>
                                        <div className="comment-time">{formatTime(comment.created_at)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentUser && (
                        <form className="comment-form" onSubmit={handleCommentSubmit}>
                            <div className="comment-avatar">{currentUser.name[0]}</div>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" disabled={!commentText.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
