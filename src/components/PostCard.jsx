import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import '../styles/feed.css';

const PostCard = ({ author, time, title, content, image, attachments }) => {
    const [liked, setLiked] = useState(false);

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

            <div className="post-actions">
                <button
                    className={`action-btn ${liked ? 'liked' : ''}`}
                    onClick={() => setLiked(!liked)}
                >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                    <span>Like</span>
                </button>
                <button className="action-btn">
                    <MessageCircle size={20} />
                    <span>Comment</span>
                </button>
                <button className="action-btn">
                    <Share2 size={20} />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
