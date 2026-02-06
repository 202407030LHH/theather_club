import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '../styles/feed.css';

const PostCard = ({ id, author, time, title, content, image, attachments, comments = [], likes = 0 }) => {
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { currentUser, addComment, toggleLike } = useAppContext();

    const handleLike = () => {
        if (!liked) {
            toggleLike(id);
            setLiked(true);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;
        addComment(id, commentText);
        setCommentText('');
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = (now - date) / 1000;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="author-info">
                    <div className="author-avatar">{author[0]}</div>
                    <div>
                        <div className="author-name">{author}</div>
                        <div className="post-time">{time}</div>
                    </div>
                </div>
                <button className="more-btn">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="post-content">
                {title && <h3 className="post-title">{title}</h3>}
                <p className="post-text">{content}</p>

                {image && (
                    <div className="post-image">
                        <img src={image} alt="Post content" />
                    </div>
                )}

                {attachments && (
                    <div className="post-attachments">
                        {attachments.map((att, idx) => (
                            <div key={idx} className="attachment-item">
                                <span>📎 {att.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="post-stats">
                {likes > 0 && <span className="likes-count">❤️ {likes}</span>}
                {comments.length > 0 && (
                    <span className="comments-count">{comments.length} comment{comments.length > 1 ? 's' : ''}</span>
                )}
            </div>

            <div className="post-actions">
                <button
                    className={`action-btn ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
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
                                    <div className="comment-avatar">{comment.authorName[0]}</div>
                                    <div className="comment-content">
                                        <div className="comment-author">{comment.authorName}</div>
                                        <div className="comment-text">{comment.text}</div>
                                        <div className="comment-time">{formatTime(comment.time)}</div>
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
