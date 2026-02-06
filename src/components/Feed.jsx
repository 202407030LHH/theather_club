import React from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { useAppContext } from '../context/AppContext';

const Feed = () => {
    const { posts, loading } = useAppContext();

    // created_at 기준 내림차순 정렬
    const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    );

    if (loading) {
        return (
            <div className="feed-container">
                <div className="loading-message">Loading...</div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <CreatePost />
            {sortedPosts.map(post => (
                <PostCard
                    key={post.id}
                    {...post}
                />
            ))}
            {sortedPosts.length === 0 && (
                <div className="empty-feed">
                    <p>No posts yet. Be the first to share something!</p>
                </div>
            )}
        </div>
    );
};

export default Feed;
