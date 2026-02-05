import React from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { useAppContext } from '../context/AppContext';

const Feed = () => {
    const { posts } = useAppContext();

    // Sort by time descending
    const sortedPosts = [...posts].sort((a, b) => new Date(b.time) - new Date(a.time));

    // Helper to format visual time (simple version)
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="feed-container">
            <CreatePost />
            {sortedPosts.map(post => (
                <PostCard
                    key={post.id}
                    author={post.authorName}
                    time={formatTime(post.time)}
                    {...post}
                />
            ))}
        </div>
    );
};

export default Feed;
