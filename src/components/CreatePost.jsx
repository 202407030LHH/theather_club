import React, { useState, useRef } from 'react';
import { Image, Paperclip, Send, X, Loader } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getImageUrl } from '../services/api';
import '../styles/create-post.css';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const { currentUser, createPost, uploadImage, uploadFile } = useAppContext();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            // 미리보기용
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setAttachmentFiles([...attachmentFiles, ...files]);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const removeAttachment = (index) => {
        setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            let imageUrl = null;
            let attachments = [];

            // 이미지 업로드
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            // 파일 업로드
            if (attachmentFiles.length > 0) {
                for (const file of attachmentFiles) {
                    const result = await uploadFile(file);
                    attachments.push(result);
                }
            }

            // 게시물 생성
            await createPost({
                content,
                image_url: imageUrl,
                attachments: attachments.length > 0 ? attachments : undefined
            });

            // 폼 초기화
            setContent('');
            setImageFile(null);
            setImagePreview(null);
            setAttachmentFiles([]);
            if (imageInputRef.current) imageInputRef.current.value = '';
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error('게시물 작성 실패:', error);
            alert('게시물 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
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
                        disabled={isSubmitting}
                    />
                </div>

                {imagePreview && (
                    <div className="image-preview">
                        <button type="button" className="remove-image-btn" onClick={removeImage} disabled={isSubmitting}>
                            <X size={20} />
                        </button>
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}

                {attachmentFiles.length > 0 && (
                    <div className="attachments-preview">
                        {attachmentFiles.map((file, idx) => (
                            <div key={idx} className="attachment-preview-item">
                                <span>📎 {file.name}</span>
                                <button type="button" onClick={() => removeAttachment(idx)} disabled={isSubmitting}>
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
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            className="tool-btn"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            className="tool-btn"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                        >
                            <Paperclip size={20} />
                            <span>File</span>
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="post-submit-btn"
                        disabled={!content.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader size={16} className="spin" />
                        ) : (
                            <Send size={16} />
                        )}
                        <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
