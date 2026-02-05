import React, { useState, useRef } from 'react';
import { Image, Paperclip, Send, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '../styles/create-post.css';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const { currentUser, createPost } = useAppContext();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map(file => ({
            name: file.name,
            size: file.size
        }));
        setAttachments([...attachments, ...newAttachments]);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        createPost({
            content,
            image: imagePreview,
            attachments: attachments.length > 0 ? attachments : undefined
        });

        setContent('');
        setImagePreview(null);
        setAttachments([]);
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!currentUser) return null;

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
                <div className="cp-header">
                    <div className="cp-avatar">{currentUser.name[0]}</div>
                    <textarea
                        placeholder={`What's on your mind, ${currentUser.name}?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                    />
                </div>

                {imagePreview && (
                    <div className="image-preview">
                        <button type="button" className="remove-image-btn" onClick={removeImage}>
                            <X size={20} />
                        </button>
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}

                {attachments.length > 0 && (
                    <div className="attachments-preview">
                        {attachments.map((att, idx) => (
                            <div key={idx} className="attachment-preview-item">
                                <span>📎 {att.name}</span>
                                <button type="button" onClick={() => removeAttachment(idx)}>
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="cp-footer">
                    <div className="cp-tools">
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageSelect}
                        />
                        <button
                            type="button"
                            className="tool-btn"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <Image size={20} />
                            <span>Photo</span>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <button
                            type="button"
                            className="tool-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip size={20} />
                            <span>File</span>
                        </button>
                    </div>
                    <button type="submit" className="post-submit-btn" disabled={!content.trim()}>
                        <Send size={16} />
                        <span>Post</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
